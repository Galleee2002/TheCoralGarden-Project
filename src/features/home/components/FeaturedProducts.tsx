import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductCard } from "@/components/shared/ProductCard";
import { getFeaturedProducts } from "@/features/products/actions/getFeaturedProducts";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <SectionHeader
            title="Productos destacados"
            subtitle="Los más elegidos por nuestros clientes."
          />
          <Button asChild variant="ghost" className="hidden gap-1 sm:flex">
            <Link href="/productos">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              image={product.images[0]}
              category={product.category.name}
              stock={product.stock}
              featured={product.featured}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/productos">Ver todos los productos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
