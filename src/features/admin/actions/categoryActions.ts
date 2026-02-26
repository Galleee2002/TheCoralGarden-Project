"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export const createCategory = action
  .schema(categorySchema)
  .action(async ({ parsedInput }) => {
    const cat = await prisma.category.create({ data: parsedInput });
    return { id: cat.id };
  });

export const updateCategory = action
  .schema(categorySchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const cat = await prisma.category.update({ where: { id }, data });
    return { id: cat.id };
  });

export const deleteCategory = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.category.delete({ where: { id: parsedInput.id } });
    return { success: true };
  });
