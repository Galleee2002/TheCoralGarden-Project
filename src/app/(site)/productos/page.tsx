import { Suspense } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FiltersPanel } from "@/features/products/components/FiltersPanel";
import { ProductsGrid } from "@/features/products/components/ProductsGrid";
import { getProducts } from "@/features/products/actions/getProducts";
import { getCategories } from "@/features/products/actions/getCategories";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo completo de equipos de purificación y tratamiento de agua.",
};

interface ProductsPageProps {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
}

async function ProductsCatalog({
  categorySlug,
  page,
}: {
  categorySlug?: string;
  page: number;
}) {
  const { products } = await getProducts({
    categorySlug,
    page,
    pageSize: 12,
  });

  return <ProductsGrid products={products} />;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { categoria, pagina } = await searchParams;
  const page = Number(pagina ?? "1");

  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-10">
      <SectionHeader
        title="Catálogo de productos"
        subtitle="Equipos de purificación para cada necesidad."
        className="mb-8"
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense>
          <FiltersPanel categories={categories} />
        </Suspense>

        <div className="flex-1">
          <Suspense
            key={`${categoria}-${page}`}
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4">
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ProductsCatalog categorySlug={categoria} page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
