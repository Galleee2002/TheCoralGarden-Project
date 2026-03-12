import { getCategories } from "@/features/products/actions/getCategories";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { CategoryManagerClient } from "@/features/admin/components/categories/CategoryManagerClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Categorías" };

export default async function AdminCategoriasPage() {
  const categories = await getCategories();

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
