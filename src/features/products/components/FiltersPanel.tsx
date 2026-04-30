"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface FiltersPanelProps {
  categories: Category[];
}

export function FiltersPanel({ categories }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("categoria");

  const setCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    params.delete("pagina");
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          "max-w-full rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-normal wrap-break-word",
          !currentCategory
            ? "bg-btn-primary text-text-secondary"
            : "bg-card-light text-text-primary hover:bg-card-light/80"
        )}
      >
        Todos los productos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            "max-w-full rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-normal wrap-break-word",
            currentCategory === cat.slug
              ? "bg-btn-primary text-text-secondary"
              : "bg-card-light text-text-primary hover:bg-card-light/80"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
