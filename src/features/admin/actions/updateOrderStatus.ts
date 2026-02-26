"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { OrderStatus } from "@/types/enums";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const),
});

export const updateOrderStatus = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const order = await prisma.order.update({
      where: { id: parsedInput.orderId },
      data: { status: parsedInput.status as OrderStatus },
    });
    return { id: order.id, status: order.status };
  });
