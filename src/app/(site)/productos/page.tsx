import { Suspense } from "react";
import { FiltersPanel } from "@/features/products/components/FiltersPanel";
import { ProductsGrid } from "@/features/products/components/ProductsGrid";
import { SearchBar } from "@/features/products/components/SearchBar";
import { ProductsPagination } from "@/features/products/components/ProductsPagination";
import { getProducts } from "@/features/products/actions/getProducts";
import { getCategories } from "@/features/products/actions/getCategories";
import { MiniBanner } from "@/features/home/components/MiniBanner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo completo de equipos de purificación y tratamiento de agua.",
  alternates: {
    canonical: "/productos",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ categoria?: string; pagina?: string; q?: string }>;
}

async function ProductsCatalog({
  categorySlug,
  page,
  query,
}: {
  categorySlug?: string;
  page: number;
  query?: string;
}) {
  const { products, totalPages, currentPage } = await getProducts({
    categorySlug,
    query,
    page,
    pageSize: 16,
  });

  return (
    <>
      <ProductsGrid products={products} />
      <Suspense>
        <ProductsPagination totalPages={totalPages} currentPage={currentPage} />
      </Suspense>
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { categoria, pagina, q } = await searchParams;
  const page = Number(pagina ?? "1");

  const categories = await getCategories();

  return (
    <>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-section-mobile md:py-section">
          {/* Header row */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="font-heading text-[56px] font-black leading-[1.1] text-text-primary uppercase md:text-[64px] lg:text-[96px]">
              PRODUCTOS
            </h1>
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>

          {/* Filter chips */}
          <div className="mb-8">
            <Suspense>
              <FiltersPanel categories={categories} />
            </Suspense>
          </div>

          {/* Grid + pagination */}
          <Suspense
            key={`${categoria}-${page}-${q}`}
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-card border">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4">
                      <Skeleton className="mb-2 h-5 w-3/4" />
                      <Skeleton className="mb-4 h-4 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ProductsCatalog categorySlug={categoria} page={page} query={q} />
          </Suspense>
        </div>
      </div>

      <MiniBanner />
    </>
  );
}
