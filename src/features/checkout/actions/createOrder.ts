"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive(),
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
  shippingCost: z.number().min(0),
});

export const createOrder = action
  .schema(createOrderSchema)
  .action(async ({ parsedInput }) => {
    const subtotal = parsedInput.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const total = subtotal + parsedInput.shippingCost;

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
        shippingCost: parsedInput.shippingCost,
        total,
        items: {
          create: parsedInput.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return { orderId: order.id, total: order.total };
  });
