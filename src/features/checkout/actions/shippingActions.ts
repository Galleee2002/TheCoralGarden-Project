"use server";

import { action } from "@/lib/safe-action";
import {
  getCorreoArgentinoAgencies,
  quoteCorreoArgentinoShipping,
} from "@/lib/correo-argentino/client";
import { ShippingDeliveryType } from "@/types/shipping";
import { z } from "zod";

const quoteShippingSchema = z.object({
  customerZip: z.string().min(3, "Codigo postal requerido"),
  deliveryType: z
    .enum([ShippingDeliveryType.HOME, ShippingDeliveryType.AGENCY])
    .optional(),
});

export const quoteShipping = action
  .schema(quoteShippingSchema)
  .action(async ({ parsedInput }) => {
    const rates = await quoteCorreoArgentinoShipping({
      postalCodeDestination: parsedInput.customerZip,
      deliveredType: parsedInput.deliveryType,
    });

    return { rates };
  });

const getShippingAgenciesSchema = z.object({
  customerProvince: z.string().min(2, "Provincia requerida"),
});

export const getShippingAgencies = action
  .schema(getShippingAgenciesSchema)
  .action(async ({ parsedInput }) => {
    const agencies = await getCorreoArgentinoAgencies(
      parsedInput.customerProvince
    );

    return {
      agencies: agencies.filter((agency) => agency.code),
    };
  });
