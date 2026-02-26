"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { TechnicalServiceStatus } from "@/types/enums";
import { z } from "zod";

const schema = z.object({
  requestId: z.string(),
  status: z.enum([
    "PENDING",
    "CONTACTED",
    "IN_PROGRESS",
    "RESOLVED",
  ] as const),
  adminNotes: z.string().optional(),
});

export const updateTechnicalRequestStatus = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const req = await prisma.technicalServiceRequest.update({
      where: { id: parsedInput.requestId },
      data: {
        status: parsedInput.status as TechnicalServiceStatus,
        ...(parsedInput.adminNotes !== undefined && {
          adminNotes: parsedInput.adminNotes,
        }),
      },
    });
    return { id: req.id, status: req.status };
  });
