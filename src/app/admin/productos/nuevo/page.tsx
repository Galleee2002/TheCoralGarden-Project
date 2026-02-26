import { getCategories } from "@/features/products/actions/getCategories";
import { ProductForm } from "@/features/admin/components/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Nuevo Producto" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nuevo producto</h1>
      <div className="max-w-2xl rounded-xl border bg-card p-6">
        <ProductForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
