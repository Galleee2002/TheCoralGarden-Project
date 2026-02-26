"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <aside className="w-full lg:w-56">
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Categorías
        </h2>
        <ul className="flex flex-col gap-1">
          <li>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between px-3",
                !currentCategory && "bg-primary/10 font-medium text-primary",
              )}
              onClick={() => setCategory(null)}
            >
              Todos los productos
            </Button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between px-3",
                  currentCategory === cat.slug &&
                    "bg-primary/10 font-medium text-primary",
                )}
                onClick={() => setCategory(cat.slug)}
              >
                <span>{cat.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {cat._count.products}
                </Badge>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
