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
    await prisma.product.delete({ where: { id: parsedInput.id } });
    revalidatePath("/admin", "layout");
    return { success: true };
  });
