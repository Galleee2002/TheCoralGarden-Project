import { ProductCard } from "@/components/shared/ProductCard";
import { PackageSearch } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | { toString(): string };
  images: string[];
  stock: number;
  featured: boolean;
  category: { name: string; slug: string };
}

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No hay productos</h3>
        <p className="text-sm text-muted-foreground">
          No encontramos productos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          description={product.description ?? undefined}
          price={Number(product.price)}
          image={product.images[0]}
          stock={product.stock}
        />
      ))}
    </div>
  );
}
