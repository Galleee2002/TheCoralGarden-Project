"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductsPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function ProductsPagination({
  totalPages,
  currentPage,
}: ProductsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(page));
    router.push(`/productos?${params.toString()}`);
  };

  // Build page items: always show first, last, currentPage ±1
  const items: Array<{ type: "page"; page: number } | { type: "ellipsis"; key: string }> = [];
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  let lastAdded = 0;

  for (const p of pages) {
    const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
    if (show) {
      if (lastAdded && p - lastAdded > 1) {
        items.push({ type: "ellipsis", key: `e-${p}` });
      }
      items.push({ type: "page", page: p });
      lastAdded = p;
    }
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) goTo(currentPage - 1);
            }}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {items.map((item) =>
          item.type === "ellipsis" ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.page}>
              <PaginationLink
                href="#"
                isActive={item.page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item.page);
                }}
              >
                {item.page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) goTo(currentPage + 1);
            }}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
