"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";

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
      <button
        onClick={navigate}
        className="absolute left-3 text-text-primary/50 hover:text-text-primary"
        aria-label="Buscar"
        type="button"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        ref={inputRef}
        type="text"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Buscar productos..."
        onKeyDown={(e) => e.key === "Enter" && navigate()}
        className="w-full rounded-md bg-card-light py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-primary/50 focus:outline-none focus:ring-2 focus:ring-btn-primary/30"
      />
    </div>
  );
}
