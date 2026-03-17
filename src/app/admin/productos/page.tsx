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
import { Plus } from "lucide-react";
import type { Metadata } from "next";

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

  const formatPrice = (p: number | { toString(): string }) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(p));

  return (
    <div>
      <AdminPageHeader
        title="Productos"
        description="Catálogo de productos de la tienda"
        action={
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
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

      <div
        role="region"
        aria-label="Tabla de productos"
        className="overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <EmptyState colSpan={6} message="No hay productos cargados" />
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
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
                      <Button asChild variant="outline" size="sm">
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
