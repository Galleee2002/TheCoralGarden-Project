import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/safe-action";
import { getCategories } from "@/features/products/actions/getCategories";
import { ProductFormTabs } from "@/features/admin/components/products/ProductFormTabs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Editar Producto" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Editar producto"
        description={`Modificando: ${product.name}`}
      />
      <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
        <ProductFormTabs
          categories={categories}
          mode="edit"
          defaultValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            stock: product.stock,
            images: product.images,
            specifications: product.specifications,
            categoryId: product.categoryId,
            featured: product.featured,
            active: product.active,
          }}
        />
      </div>
    </div>
  );
}
