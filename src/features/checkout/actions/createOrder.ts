"use server";

import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { quoteCorreoArgentinoShipping } from "@/lib/correo-argentino/client";
import {
  ShippingCarrier,
  ShippingDeliveryType,
  ShippingImportStatus,
} from "@/types/shipping";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email invalido"),
  customerPhone: z.string().min(6, "Telefono requerido"),
  customerStreet: z.string().min(3, "Calle requerida"),
  customerStreetNumber: z.string().min(1, "Altura requerida"),
  customerFloor: z.string().optional(),
  customerApartment: z.string().optional(),
  customerCity: z.string().min(2, "Ciudad requerida"),
  customerProvince: z.string().min(2, "Provincia requerida"),
  customerZip: z.string().min(3, "Codigo postal requerido"),
  shippingDeliveryType: z.enum([
    ShippingDeliveryType.HOME,
    ShippingDeliveryType.AGENCY,
  ]),
  shippingProductType: z.string().min(1, "Producto de envio requerido"),
  shippingProductName: z.string().min(1, "Metodo de envio requerido"),
  shippingCost: z.number().min(0.01, "Cotizacion de envio requerida"),
  shippingAgency: z.string().optional(),
  shippingAgencyName: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "El carrito esta vacio"),
});

export const createOrder = action
  .schema(createOrderSchema)
  .action(async ({ parsedInput }) => {
    const productIds = [
      ...new Set(parsedInput.items.map((item) => item.productId)),
    ];
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
      throw new Error("Uno o mas productos ya no estan disponibles.");
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    const items = parsedInput.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error("Uno o mas productos ya no estan disponibles.");
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

    const shippingRates = await quoteCorreoArgentinoShipping({
      postalCodeDestination: parsedInput.customerZip,
      deliveredType: parsedInput.shippingDeliveryType,
    });
    const selectedRate = shippingRates.find(
      (rate) =>
        rate.deliveredType === parsedInput.shippingDeliveryType &&
        rate.productType === parsedInput.shippingProductType &&
        Math.abs(rate.price - parsedInput.shippingCost) < 0.01
    );

    if (!selectedRate) {
      throw new Error("La cotizacion de envio ya no esta disponible.");
    }

    if (
      parsedInput.shippingDeliveryType === ShippingDeliveryType.AGENCY &&
      !parsedInput.shippingAgency
    ) {
      throw new Error("Selecciona una sucursal de Correo Argentino.");
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const shippingCost = Number(selectedRate.price.toFixed(2));
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        customerName: parsedInput.customerName,
        customerEmail: parsedInput.customerEmail,
        customerPhone: parsedInput.customerPhone,
        customerStreet: parsedInput.customerStreet,
        customerStreetNumber: parsedInput.customerStreetNumber,
        customerFloor: parsedInput.customerFloor || null,
        customerApartment: parsedInput.customerApartment || null,
        customerCity: parsedInput.customerCity,
        customerProvince: parsedInput.customerProvince,
        customerZip: parsedInput.customerZip,
        subtotal,
        shippingCost,
        total,
        shippingCarrier: ShippingCarrier.CORREO_ARGENTINO,
        shippingDeliveryType: selectedRate.deliveredType,
        shippingProductType: selectedRate.productType,
        shippingProductName: selectedRate.productName,
        shippingAgency: parsedInput.shippingAgency || null,
        shippingAgencyName: parsedInput.shippingAgencyName || null,
        shippingDeliveryTimeMin: selectedRate.deliveryTimeMin,
        shippingDeliveryTimeMax: selectedRate.deliveryTimeMax,
        shippingQuoteValidTo: selectedRate.validTo
          ? new Date(selectedRate.validTo)
          : null,
        shippingImportStatus: ShippingImportStatus.PENDING,
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

    return { orderId: order.id, total: order.total };
  });
