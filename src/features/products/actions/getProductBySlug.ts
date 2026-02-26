import { prisma } from "@/lib/prisma/client";

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: { select: { name: true, slug: true } } },
  });
}
