import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

interface GetProductsParams {
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
  activeOnly?: boolean;
  includeOrderHistory?: boolean;
}

export async function getProducts({
  categorySlug,
  query,
  page = 1,
  pageSize = 12,
  activeOnly = true,
  includeOrderHistory = false,
}: GetProductsParams = {}) {
  const where: Prisma.ProductWhereInput = {
    ...(activeOnly && { active: true }),
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(query && {
      name: { contains: query, mode: "insensitive" },
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        ...(includeOrderHistory
          ? { _count: { select: { orderItems: true } } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}
