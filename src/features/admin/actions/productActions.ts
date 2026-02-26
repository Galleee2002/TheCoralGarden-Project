"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string(),
});

export const createProduct = action
  .schema(productSchema)
  .action(async ({ parsedInput }) => {
    const product = await prisma.product.create({ data: parsedInput });
    return { id: product.id };
  });

export const updateProduct = action
  .schema(productSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const product = await prisma.product.update({ where: { id }, data });
    return { id: product.id };
  });

export const deleteProduct = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.product.delete({ where: { id: parsedInput.id } });
    return { success: true };
  });
