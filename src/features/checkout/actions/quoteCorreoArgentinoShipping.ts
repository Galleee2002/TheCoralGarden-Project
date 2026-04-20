"use server";

import { action } from "@/lib/safe-action";
import { quoteShippingForItems } from "@/lib/correo-argentino/service";
import { z } from "zod";

const quoteShippingSchema = z.object({
  customerZip: z.string().trim().min(3, "Código postal requerido"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "El carrito está vacío"),
});

export const quoteCorreoArgentinoShipping = action
  .schema(quoteShippingSchema)
  .action(async ({ parsedInput }) => {
    const result = await quoteShippingForItems(parsedInput);

    return result.quote;
  });
