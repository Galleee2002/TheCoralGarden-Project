"use server";

import { action } from "@/lib/safe-action";
import { quoteShippingForItems } from "@/lib/correo-argentino/service";
import { prisma } from "@/lib/prisma/client";
import { ShippingImportStatus } from "@/types/enums";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(6, "Teléfono requerido"),
  customerStreet: z.string().min(3, "Dirección requerida"),
  customerCity: z.string().min(2, "Ciudad requerida"),
  customerProvince: z.string().min(2, "Provincia requerida"),
  customerZip: z.string().min(3, "Código postal requerido"),
  items: z.array(orderItemSchema).min(1, "El carrito está vacío"),
});

export const createOrder = action
  .schema(createOrderSchema)
  .action(async ({ parsedInput }) => {
    const productIds = [...new Set(parsedInput.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("Uno o más productos ya no están disponibles.");
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const items = parsedInput.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error("Uno o más productos ya no están disponibles.");
      }

      if (product.stock < item.quantity) {
        throw new Error(`No hay stock suficiente para ${product.name}.`);
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: Number(product.price),
      };
    });

    const shippingQuote = await quoteShippingForItems({
      customerZip: parsedInput.customerZip,
      items: parsedInput.items,
    });

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingCost = shippingQuote.quote.price;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        customerName: parsedInput.customerName,
        customerEmail: parsedInput.customerEmail,
        customerPhone: parsedInput.customerPhone,
        customerStreet: parsedInput.customerStreet,
        customerCity: parsedInput.customerCity,
        customerProvince: parsedInput.customerProvince,
        customerZip: parsedInput.customerZip,
        subtotal,
        shippingCost,
        shippingMethod: "correo_argentino_home",
        shippingQuoteProvider: "correo_argentino",
        shippingQuotedAt: new Date(),
        shippingRatePayload: shippingQuote.payload,
        shippingImportStatus: ShippingImportStatus.PENDING,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return {
      orderId: order.id,
      total: Number(order.total),
      shippingCost: Number(order.shippingCost),
    };
  });
