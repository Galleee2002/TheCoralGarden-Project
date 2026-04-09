"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  defaultValue: string;
  activeCategory?: string | null;
}

export function ProductSearchBar({
  defaultValue,
  activeCategory,
}: ProductSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const navigate = (value?: string) => {
    const nextValue = value ?? inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());

    if (activeCategory) {
      params.set("category", activeCategory);
    } else {
      params.delete("category");
    }

    if (nextValue) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    navigate("");
  };

  return (
    <div className="w-full max-w-xl">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        Buscar producto por título
      </label>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => navigate()}
          aria-label="Buscar producto"
          className="absolute left-1 inline-flex h-11 w-11 items-center justify-center rounded-button text-text-primary/65 transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Search className="h-4 w-4" />
        </button>

        <Input
          id={inputId}
          ref={inputRef}
          type="search"
          defaultValue={defaultValue}
          placeholder="Ej. Acuario, Bomba, Filtro"
          autoComplete="off"
          onKeyDown={(event) => event.key === "Enter" && navigate()}
          className="h-11 rounded-card border-border/60 bg-card-light pl-12 pr-12 text-sm text-text-primary placeholder:text-text-primary/55"
        />

        {defaultValue ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Limpiar búsqueda"
            className="absolute right-1 inline-flex h-11 w-11 items-center justify-center rounded-button text-text-primary/65 transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        La búsqueda respeta la categoría seleccionada y encuentra coincidencias
        por nombre.
      </p>
    </div>
  );
}
