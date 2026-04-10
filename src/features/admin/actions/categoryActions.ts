"use server";

import { adminAction as action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const createCategory = action
  .schema(categorySchema)
  .action(async ({ parsedInput }) => {
    const cat = await prisma.category.create({ data: parsedInput });
    revalidatePath("/admin", "layout");
    return { id: cat.id, name: cat.name, slug: cat.slug };
  });

export const updateCategory = action
  .schema(categorySchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const cat = await prisma.category.update({ where: { id }, data });
    revalidatePath("/admin", "layout");
    return { id: cat.id, name: cat.name, slug: cat.slug };
  });

export const deleteCategory = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const products = await prisma.product.findMany({
      where: {
        categoryId: parsedInput.id,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    const productsWithOrders = products.filter(
      (product) => product._count.orderItems > 0,
    );
    const affectedNames = productsWithOrders.slice(0, 3).map((product) => product.name);

    if (productsWithOrders.length > 0) {
      return {
        success: false,
        result: "blocked" as const,
        message:
          "No se puede eliminar esta categoría porque tiene productos con compras asociadas.",
        reason: "has_order_history" as const,
        affectedCount: productsWithOrders.length,
        affectedNames,
      };
    }

    try {
      await prisma.product.deleteMany({
        where: { categoryId: parsedInput.id },
      });
      await prisma.category.delete({ where: { id: parsedInput.id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return {
          success: false,
          result: "blocked" as const,
          message:
            "No se pudo eliminar la categoría porque uno o más productos tienen compras asociadas.",
          reason: "has_order_history" as const,
        };
      }

      throw error;
    }

    revalidatePath("/admin", "layout");
    return {
      success: true,
      result: "deleted" as const,
      message:
        products.length > 0
          ? "Categoría y productos asociados eliminados."
          : "Categoría eliminada.",
      affectedCount: products.length,
    };
  });

export const forceDeleteCategory = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const products = await prisma.product.findMany({
      where: { categoryId: parsedInput.id },
      select: { id: true },
    });

    const productIds = products.map((product) => product.id);

    const orderIds = productIds.length
      ? await prisma.orderItem.findMany({
          where: {
            productId: { in: productIds },
          },
          select: { orderId: true },
          distinct: ["orderId"],
        })
      : [];

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

      if (productIds.length > 0) {
        await tx.product.deleteMany({
          where: { id: { in: productIds } },
        });
      }

      await tx.category.delete({
        where: { id: parsedInput.id },
      });
    });

    revalidatePath("/admin", "layout");

    return {
      success: true,
      result: "force-deleted" as const,
      message:
        orderIdList.length > 0
          ? "Categoría, productos y ventas asociadas eliminados de forma permanente."
          : products.length > 0
            ? "Categoría y productos asociados eliminados de forma permanente."
            : "Categoría eliminada de forma permanente.",
      affectedCount: products.length,
      affectedOrderCount: orderIdList.length,
    };
  });
