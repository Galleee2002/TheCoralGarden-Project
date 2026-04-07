import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/safe-action";
import type { OrderStatus } from "@/types/enums";

interface GetOrdersParams {
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
}

export async function getOrders({
  status,
  page = 1,
  pageSize = 20,
}: GetOrdersParams = {}) {
  await requireAdmin();

  const where = status ? { status } : {};

  const [rawOrders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  const orders = rawOrders.map((order) => ({
    ...order,
    subtotal: order.subtotal.toNumber(),
    shippingCost: order.shippingCost.toNumber(),
    total: order.total.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
    })),
  }));

  return { orders, total, totalPages: Math.ceil(total / pageSize) };
}
