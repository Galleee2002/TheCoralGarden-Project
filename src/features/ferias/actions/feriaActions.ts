"use server";

import { adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const feriaSchema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  date: z.string().min(1, "La fecha es requerida"),
});

export async function getFerias() {
  return prisma.fair.findMany({
    orderBy: { date: "desc" },
  });
}

export async function getFeriaById(id: string) {
  return prisma.fair.findUnique({ where: { id } });
}

export const createFeria = adminAction
  .schema(feriaSchema)
  .action(async ({ parsedInput }) => {
    const feria = await prisma.fair.create({
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
        date: new Date(parsedInput.date),
      },
    });
    revalidatePath("/ferias");
    revalidatePath("/admin/ferias");
    return { id: feria.id, title: feria.title };
  });

export const updateFeria = adminAction
  .schema(feriaSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const feria = await prisma.fair.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        date: new Date(data.date),
      },
    });
    revalidatePath("/ferias");
    revalidatePath("/admin/ferias");
    return { id: feria.id, title: feria.title };
  });

export const deleteFeria = adminAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.fair.delete({ where: { id: parsedInput.id } });
    revalidatePath("/ferias");
    revalidatePath("/admin/ferias");
    return { success: true };
  });
