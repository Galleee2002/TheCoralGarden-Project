import { prisma } from "@/lib/prisma/client";

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
