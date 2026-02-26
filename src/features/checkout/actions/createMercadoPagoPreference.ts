"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
});

export const createMercadoPagoPreference = action
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const order = await prisma.order.findUnique({
      where: { id: parsedInput.orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Orden no encontrada");

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const result = await preference.create({
      body: {
        external_reference: order.id,
        items: order.items.map((item) => ({
          id: item.productId,
          title: item.productName,
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          currency_id: "ARS",
        })),
        payer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: { number: order.customerPhone },
          address: {
            street_name: order.customerStreet,
            zip_code: order.customerZip,
          },
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mp`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: result.id },
    });

    return { preferenceId: result.id, initPoint: result.init_point };
  });
