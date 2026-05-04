import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/safe-action";
import type { OrderStatus } from "@/types/enums";

export type CustomerOrderLineItem = {
  orderItemId: string;
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CustomerOrderSummary = {
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  shippingCarrier: string | null;
  shippingDeliveryType: string | null;
  shippingProductName: string | null;
  shippingAgencyName: string | null;
  shippingTrackingNumber: string | null;
  shippingImportStatus: string | null;
  shippingImportError: string | null;
  items: CustomerOrderLineItem[];
};

export type CustomerRow = {
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: Date;
  lastStatus: OrderStatus;
  address: string;
  orders: CustomerOrderSummary[];
};

type RawOrder = {
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
  subtotal: { toNumber: () => number };
  shippingCost: { toNumber: () => number };
  total: { toNumber: () => number };
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingMethod: string;
  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  shippingCarrier: string | null;
  shippingDeliveryType: string | null;
  shippingProductName: string | null;
  shippingAgencyName: string | null;
  shippingTrackingNumber: string | null;
  shippingImportStatus: string | null;
  shippingImportError: string | null;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: { toNumber: () => number };
    product: { slug: string };
  }[];
};

function buildAddress(order: RawOrder): string {
  const street = [order.customerStreet, order.customerStreetNumber]
    .filter(Boolean)
    .join(" ");
  const floorApartment = [order.customerFloor, order.customerApartment]
    .filter(Boolean)
    .join(" ");
  const location = [order.customerCity, order.customerProvince, order.customerZip]
    .filter(Boolean)
    .join(", ");

  return [street, floorApartment, location].filter(Boolean).join(" · ");
}

function mapOrder(order: RawOrder): CustomerOrderSummary {
  return {
    orderId: order.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    subtotal: order.subtotal.toNumber(),
    shippingCost: order.shippingCost.toNumber(),
    total: order.total.toNumber(),
    shippingMethod: order.shippingMethod,
    mpPreferenceId: order.mpPreferenceId,
    mpPaymentId: order.mpPaymentId,
    shippingCarrier: order.shippingCarrier,
    shippingDeliveryType: order.shippingDeliveryType,
    shippingProductName: order.shippingProductName,
    shippingAgencyName: order.shippingAgencyName,
    shippingTrackingNumber: order.shippingTrackingNumber,
    shippingImportStatus: order.shippingImportStatus,
    shippingImportError: order.shippingImportError,
    items: order.items.map((it) => {
      const unitPrice = it.unitPrice.toNumber();
      return {
        orderItemId: it.id,
        productId: it.productId,
        productSlug: it.product.slug,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice,
        lineTotal: unitPrice * it.quantity,
      };
    }),
  };
}

export async function getCustomers(): Promise<{ customers: CustomerRow[] }> {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      customerStreet: true,
      customerStreetNumber: true,
      customerFloor: true,
      customerApartment: true,
      customerCity: true,
      customerProvince: true,
      customerZip: true,
      subtotal: true,
      shippingCost: true,
      total: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shippingMethod: true,
      mpPreferenceId: true,
      mpPaymentId: true,
      shippingCarrier: true,
      shippingDeliveryType: true,
      shippingProductName: true,
      shippingAgencyName: true,
      shippingTrackingNumber: true,
      shippingImportStatus: true,
      shippingImportError: true,
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          quantity: true,
          unitPrice: true,
          product: { select: { slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const customersByEmail = new Map<string, CustomerRow>();

  for (const order of orders) {
    const email = order.customerEmail.trim().toLowerCase();
    const summary = mapOrder(order);
    const current = customersByEmail.get(email);

    if (!current) {
      customersByEmail.set(email, {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        ordersCount: 1,
        totalSpent: order.total.toNumber(),
        lastOrderAt: order.createdAt,
        lastStatus: order.status,
        address: buildAddress(order),
        orders: [summary],
      });
      continue;
    }

    current.ordersCount += 1;
    current.totalSpent += order.total.toNumber();
    current.orders.push(summary);
  }

  const customers = Array.from(customersByEmail.values()).sort(
    (a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime()
  );

  return { customers };
}
