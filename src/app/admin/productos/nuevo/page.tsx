import { getCategories } from "@/features/products/actions/getCategories";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Nuevo Producto" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <AdminPageHeader
        title="Nuevo producto"
        description="Agregá un nuevo producto al catálogo"
      />
      <div className="max-w-2xl rounded-card border border-border/50 bg-card p-6 shadow-sm">
        <ProductForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
