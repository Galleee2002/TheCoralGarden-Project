import { prisma } from "@/lib/prisma/client";
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
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, totalPages: Math.ceil(total / pageSize) };
}
