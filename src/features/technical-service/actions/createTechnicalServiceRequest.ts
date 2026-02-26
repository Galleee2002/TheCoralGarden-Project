"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono requerido"),
  equipmentBrand: z.string().min(1, "Marca requerida"),
  useCase: z.enum([
    "ACUARISMO",
    "CULTIVO_INDOOR",
    "DOMESTICO",
    "COMERCIAL",
    "INDUSTRIAL",
  ] as const),
  issueDescription: z
    .string()
    .min(10, "Describí el problema (mínimo 10 caracteres)"),
});

export const createTechnicalServiceRequest = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const request = await prisma.technicalServiceRequest.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: parsedInput as any,
    });
    return { id: request.id };
  });
