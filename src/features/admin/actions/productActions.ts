"use server";

import { adminAction as action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  specifications: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string(),
});

export const createProduct = action
  .schema(productSchema)
  .action(async ({ parsedInput }) => {
    try {
      const product = await prisma.product.create({ data: parsedInput });
      revalidatePath("/admin", "layout");
      return { id: product.id };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("El slug ya existe. Cambiá el nombre del producto o editá el slug manualmente.");
      }
      throw e;
    }
  });

export const updateProduct = action
  .schema(productSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    try {
      const product = await prisma.product.update({ where: { id }, data });
      revalidatePath("/admin", "layout");
      return { id: product.id };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("El slug ya existe. Editá el slug manualmente para que sea único.");
      }
      throw e;
    }
  });

export const deleteProduct = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const product = await prisma.product.findUnique({
      where: { id: parsedInput.id },
      select: {
        id: true,
        active: true,
      },
    });

    if (!product) {
      throw new Error("No se encontró el producto.");
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: parsedInput.id },
    });

    if (orderItemCount > 0) {
      if (product.active) {
        await prisma.product.update({
          where: { id: parsedInput.id },
          data: {
            active: false,
            featured: false,
          },
        });
      }

      revalidatePath("/admin", "layout");

      return {
        success: true,
        result: "archived" as const,
        message:
          "El producto tiene compras asociadas. Se archivó para ocultarlo de la tienda sin perder el historial.",
        reason: "has_order_history" as const,
        affectedCount: orderItemCount,
      };
    }

    await prisma.product.delete({ where: { id: parsedInput.id } });
    revalidatePath("/admin", "layout");
    return {
      success: true,
      result: "deleted" as const,
      message: "Producto eliminado definitivamente.",
    };
  });

export const forceDeleteProduct = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const orderIds = await prisma.orderItem.findMany({
      where: { productId: parsedInput.id },
      select: { orderId: true },
      distinct: ["orderId"],
    });

    const orderIdList = orderIds.map((item) => item.orderId);

    await prisma.$transaction(async (tx) => {
      if (orderIdList.length > 0) {
        await tx.orderItem.deleteMany({
          where: {
            orderId: { in: orderIdList },
          },
        });

        await tx.order.deleteMany({
          where: {
            id: { in: orderIdList },
          },
        });
      }

      await tx.product.delete({
        where: { id: parsedInput.id },
      });
    });

    revalidatePath("/admin", "layout");

    return {
      success: true,
      result: "force-deleted" as const,
      message:
        orderIdList.length > 0
          ? "Producto y ventas asociadas eliminados de forma permanente."
          : "Producto eliminado de forma permanente.",
      affectedOrderCount: orderIdList.length,
    };
  });
