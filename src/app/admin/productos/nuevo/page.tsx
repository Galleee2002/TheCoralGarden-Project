import { getCategories } from "@/features/products/actions/getCategories";
import { ProductFormTabs } from "@/features/admin/components/products/ProductFormTabs";
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
      <div className="rounded-card border border-border/50 bg-card p-4 shadow-sm sm:p-6">
        <ProductFormTabs categories={categories} mode="create" />
      </div>
    </div>
  );
}
