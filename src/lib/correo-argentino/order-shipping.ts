import { prisma } from "@/lib/prisma/client";
import {
  getCorreoArgentinoTracking,
  importOrderShipmentToCorreoArgentino,
} from "@/lib/correo-argentino/client";
import { sendShippingNotificationEmail } from "@/lib/resend/send-shipping-notification";
import type { OrderEmailData } from "@/lib/resend/types";
import {
  SHIPPING_DELIVERY_LABEL,
  ShippingCarrier,
  ShippingImportStatus,
} from "@/types/shipping";
import type { Prisma } from "@prisma/client";

type DecimalLike = { toNumber(): number };

type ShipmentOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStreet: string;
  customerStreetNumber: string | null;
  customerFloor: string | null;
  customerApartment: string | null;
  customerCity: string;
  customerProvince: string;
  customerZip: string;
  total: DecimalLike | number;
  shippingImportedAt: Date | null;
  shippingImportStatus: string | null;
  shippingDeliveryType: string | null;
  shippingProductType: string | null;
  shippingAgency: string | null;
};

type OrderWithItems = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStreet: string;
  customerCity: string;
  customerProvince: string;
  customerZip: string;
  shippingCost: DecimalLike | number;
  total: DecimalLike | number;
  shippingCarrier: string | null;
  shippingProductName: string | null;
  shippingDeliveryType: string | null;
  shippingTrackingNumber: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: DecimalLike | number;
  }>;
};

function toNumber(value: DecimalLike | number) {
  return typeof value === "number" ? value : value.toNumber();
}

export function buildOrderEmailData(order: OrderWithItems): OrderEmailData {
  const deliveryType = order.shippingDeliveryType;

  return {
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerStreet: order.customerStreet,
    customerCity: order.customerCity,
    customerProvince: order.customerProvince,
    customerZip: order.customerZip,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: toNumber(item.unitPrice),
    })),
    shippingCost: toNumber(order.shippingCost),
    total: toNumber(order.total),
    orderId: order.id,
    shippingCarrier: order.shippingCarrier,
    shippingProductName: order.shippingProductName,
    shippingDeliveryLabel:
      deliveryType === "D" || deliveryType === "S"
        ? SHIPPING_DELIVERY_LABEL[deliveryType]
        : null,
    shippingTrackingNumber: order.shippingTrackingNumber,
  };
}

export async function importShipmentForOrder(order: ShipmentOrder) {
  if (
    order.shippingImportedAt ||
    order.shippingImportStatus === ShippingImportStatus.IMPORTED
  ) {
    return { skipped: true };
  }

  try {
    const shippingImport = await importOrderShipmentToCorreoArgentino({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerStreet: order.customerStreet,
      customerStreetNumber: order.customerStreetNumber,
      customerFloor: order.customerFloor,
      customerApartment: order.customerApartment,
      customerCity: order.customerCity,
      customerProvince: order.customerProvince,
      customerZip: order.customerZip,
      total: toNumber(order.total),
      shippingDeliveryType: order.shippingDeliveryType,
      shippingProductType: order.shippingProductType,
      shippingAgency: order.shippingAgency,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shippingCarrier: ShippingCarrier.CORREO_ARGENTINO,
        shippingDeliveryType: shippingImport.deliveryType,
        shippingProductType: shippingImport.productType,
        shippingExternalOrderId: shippingImport.shippingId,
        shippingImportStatus: ShippingImportStatus.IMPORTED,
        shippingImportError: null,
        shippingImportedAt: shippingImport.createdAt,
        shippingTrackingNumber: shippingImport.trackingNumber,
      },
    });

    return { skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shippingCarrier: ShippingCarrier.CORREO_ARGENTINO,
        shippingExternalOrderId: order.id,
        shippingImportStatus: ShippingImportStatus.ERROR,
        shippingImportError: message.slice(0, 500),
      },
    });

    console.error("[Correo Argentino Import Error]", {
      orderId: order.id,
      message,
    });

    return { skipped: false, error: message };
  }
}

export async function retryOrderShipmentImport(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Orden no encontrada");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      shippingImportStatus: ShippingImportStatus.PENDING,
      shippingImportError: null,
      shippingImportedAt: null,
    },
  });

  return importShipmentForOrder({
    ...order,
    shippingImportStatus: ShippingImportStatus.PENDING,
    shippingImportedAt: null,
  });
}

export async function syncOrderTracking(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  const shippingId =
    order.shippingTrackingNumber ?? order.shippingExternalOrderId ?? order.id;

  const tracking = await getCorreoArgentinoTracking(shippingId);
  const trackingRaw = tracking.raw as Prisma.InputJsonValue;
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      shippingTrackingNumber:
        tracking.trackingNumber ?? order.shippingTrackingNumber,
      shippingTrackingLastEvent: tracking.lastEvent,
      shippingTrackingRaw: trackingRaw,
      shippingTrackingLastSyncAt: new Date(),
    },
    include: { items: true },
  });

  if (
    updatedOrder.shippingTrackingNumber &&
    !updatedOrder.shippingEmailSentAt
  ) {
    await sendShippingNotificationEmail(buildOrderEmailData(updatedOrder));
    await prisma.order.update({
      where: { id: orderId },
      data: { shippingEmailSentAt: new Date() },
    });
  }

  return updatedOrder;
}

export async function syncPendingCorreoTracking(limit = 25) {
  const orders = await prisma.order.findMany({
    where: {
      shippingCarrier: ShippingCarrier.CORREO_ARGENTINO,
      shippingImportStatus: ShippingImportStatus.IMPORTED,
      status: { in: ["PAID", "PROCESSING", "SHIPPED"] },
      OR: [
        { shippingTrackingLastSyncAt: null },
        {
          shippingTrackingLastSyncAt: {
            lt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const results = [];
  for (const order of orders) {
    try {
      await syncOrderTracking(order.id);
      results.push({ orderId: order.id, ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      results.push({ orderId: order.id, ok: false, message });
      console.error("[Correo Argentino Tracking Sync Error]", {
        orderId: order.id,
        message,
      });
    }
  }

  return results;
}
