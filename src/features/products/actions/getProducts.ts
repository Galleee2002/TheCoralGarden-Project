import { prisma } from "@/lib/prisma/client";

interface GetProductsParams {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
  activeOnly?: boolean;
}

export async function getProducts({
  categorySlug,
  page = 1,
  pageSize = 12,
  activeOnly = true,
}: GetProductsParams = {}) {
  const where = {
    ...(activeOnly && { active: true }),
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
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
