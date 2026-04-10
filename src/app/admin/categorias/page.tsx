import { prisma } from "@/lib/prisma/client";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { CategoryManagerClient } from "@/features/admin/components/categories/CategoryManagerClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Categorías" };

export default async function AdminCategoriasPage() {
  const rawCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
      products: {
        select: {
          name: true,
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      },
    },
  });

  const categories = rawCategories.map((category) => {
    const productsWithOrders = category.products.filter(
      (product) => product._count.orderItems > 0,
    );

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      _count: category._count,
      productsWithOrdersCount: productsWithOrders.length,
      affectedProductNames: productsWithOrders.slice(0, 3).map((product) => product.name),
    };
  });

  return (
    <div>
      <AdminPageHeader
        title="Categorías"
        description="Gestioná las categorías del catálogo de productos"
      />
      <CategoryManagerClient categories={categories} />
    </div>
  );
}
