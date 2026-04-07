"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = () => {
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    params.set("pagina", "1");
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full max-w-full items-center md:max-w-xs">
      <label htmlFor="products-search" className="sr-only">
        Buscar productos
      </label>
      <button
        onClick={navigate}
        className="text-text-primary/50 hover:text-text-primary absolute left-3"
        aria-label="Buscar"
        type="button"
      >
        <Search className="h-4 w-4" />
      </button>
      <Input
        id="products-search"
        name="q"
        ref={inputRef}
        type="text"
        defaultValue={searchParams.get("q") ?? ""}
        aria-label="Buscar productos"
        autoComplete="off"
        placeholder="Buscar productos…"
        onKeyDown={(e) => e.key === "Enter" && navigate()}
        className="bg-card-light text-text-primary placeholder:text-text-primary/50 focus:ring-btn-primary/30 w-full rounded-lg py-2 pr-4 pl-9 text-sm focus:ring-2"
      />
    </div>
  );
}
