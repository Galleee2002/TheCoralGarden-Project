import Link from "next/link";
import { ProductCardSimple } from "@/components/shared/ProductCardSimple";
import { getFeaturedProducts } from "@/features/products/actions/getFeaturedProducts";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-bg-secondary py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-black uppercase text-white sm:text-4xl">
              Productos destacados
            </h2>
            <p className="mt-3 text-white/60">
              Los mas elegidos por nuestros clientes
            </p>
          </div>
          <Link
            href="/productos"
            className="hidden items-center gap-2 text-sm font-bold text-text-secondary transition-colors hover:text-white sm:flex"
          >
            Ver productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 gap-y-card-gap-mobile sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCardSimple
              key={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              image={product.images[0]}
              description={product.description ?? undefined}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-button border-2 border-text-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-text-secondary hover:text-bg-secondary"
          >
            Ver productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
