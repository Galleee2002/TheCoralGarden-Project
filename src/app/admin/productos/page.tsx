import { getProducts } from "@/features/products/actions/getProducts";
import { getCategories } from "@/features/products/actions/getCategories";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteProductButton } from "@/features/admin/components/products/DeleteProductButton";
import { ProductCategoryFilter } from "@/features/admin/components/products/ProductCategoryFilter";
import { Suspense } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { formatPrice } from "@/lib/format-price";

export const metadata: Metadata = { title: "Admin — Productos" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [{ products }, categories] = await Promise.all([
    getProducts({ activeOnly: false, pageSize: 100, categorySlug: category }),
    getCategories(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Productos"
        description="Catálogo de productos de la tienda"
        action={
          <Button asChild className="w-full sm:w-auto min-h-11">
            <Link href="/admin/productos/nuevo">
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Link>
          </Button>
        }
      />

      <Suspense>
        <ProductCategoryFilter
          categories={categories}
          activeSlug={category ?? null}
        />
      </Suspense>

      <div className="lg:hidden space-y-3">
        {products.length === 0 ? (
          <div className="rounded-card border border-border/50 bg-card p-6 text-center text-muted-foreground shadow-sm">
            No hay productos cargados
          </div>
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="rounded-card border border-border/50 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-text-primary break-words">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground break-words">
                    {product.category.name}
                  </p>
                </div>
                <StatusBadge
                  variant={product.active ? "active" : "inactive"}
                  label={product.active ? "Activo" : "Inactivo"}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-dropdown bg-card-light p-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Precio</p>
                  <p className="font-semibold text-text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-semibold text-text-primary">{product.stock}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="min-h-11 flex-1 justify-center"
                >
                  <Link href={`/admin/productos/${product.id}/editar`}>
                    Editar
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                  showLabel
                  className="min-h-11 flex-1 justify-center border border-destructive/40 bg-destructive/5 hover:bg-destructive/10"
                />
              </div>
            </article>
          ))
        )}
      </div>

      <div
        role="region"
        aria-label="Tabla de productos"
        className="hidden lg:block overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
        <Table className="min-w-[860px]">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[28%]" noWrap={false}>Nombre</TableHead>
              <TableHead className="w-[18%]" noWrap={false}>Categoría</TableHead>
              <TableHead className="w-[16%]">Precio</TableHead>
              <TableHead className="w-[10%]">Stock</TableHead>
              <TableHead className="w-[12%]">Estado</TableHead>
              <TableHead className="w-[16%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <EmptyState colSpan={6} message="No hay productos cargados" />
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium" noWrap={false}>
                    {product.name}
                  </TableCell>
                  <TableCell noWrap={false}>{product.category.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={product.active ? "active" : "inactive"}
                      label={product.active ? "Activo" : "Inactivo"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="min-h-9">
                        <Link href={`/admin/productos/${product.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
