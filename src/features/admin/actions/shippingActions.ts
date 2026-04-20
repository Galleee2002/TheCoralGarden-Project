"use server";

import { adminAction as action } from "@/lib/safe-action";
import {
  retryOrderShipmentImport,
  syncOrderTracking,
} from "@/lib/correo-argentino/order-shipping";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
});

export const retryShippingImport = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    await retryOrderShipmentImport(parsedInput.orderId);
    revalidatePath("/admin", "layout");
    return { success: true };
  });

export const refreshShippingTracking = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const order = await syncOrderTracking(parsedInput.orderId);
    revalidatePath("/admin", "layout");
    return {
      success: true,
      trackingNumber: order.shippingTrackingNumber,
      lastEvent: order.shippingTrackingLastEvent,
    };
  });
