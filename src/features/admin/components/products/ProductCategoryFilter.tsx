"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface ProductCategoryFilterProps {
  categories: Category[];
  activeSlug: string | null;
}

export function ProductCategoryFilter({
  categories,
  activeSlug,
}: ProductCategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("category", slug);
      } else {
        params.delete("category");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const totalProducts = categories.reduce(
    (sum, cat) => sum + cat._count.products,
    0
  );

  return (
    <div
      role="group"
      aria-label="Filtrar por categoría"
      className="flex flex-wrap items-center gap-2 py-3"
    >
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1 shrink-0">
        <Tag className="h-3.5 w-3.5" />
        Categoría:
      </span>

      {/* Chip "Todos" */}
      <button
        onClick={() => handleFilter(null)}
        aria-pressed={activeSlug === null}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          activeSlug === null
            ? "bg-btn-primary text-white shadow-sm"
            : "bg-card-light text-text-primary hover:bg-card-light/70"
        )}
      >
        Todos
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none",
            activeSlug === null
              ? "bg-white/20 text-white"
              : "bg-bg-secondary/10 text-text-primary/70"
          )}
        >
          {totalProducts}
        </span>
      </button>

      {/* Chips por categoría */}
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => handleFilter(cat.slug)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-btn-primary text-white shadow-sm"
                : "bg-card-light text-text-primary hover:bg-card-light/70"
            )}
          >
            {cat.name}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-bg-secondary/10 text-text-primary/70"
              )}
            >
              {cat._count.products}
            </span>
          </button>
        );
      })}
    </div>
  );
}
