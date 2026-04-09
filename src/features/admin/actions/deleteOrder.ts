"use server";

import { adminAction as action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteOrder = action
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.orderItem.deleteMany({
      where: { orderId: parsedInput.id },
    });

    await prisma.order.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/admin", "layout");
    return { success: true };
  });
