import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/products/actions/getProductBySlug";
import { getProducts } from "@/features/products/actions/getProducts";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { ProductInfo } from "@/features/products/components/ProductInfo";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { products: related } = await getProducts({
    categorySlug: product.category.slug,
    pageSize: 4,
  });

  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Product detail */}
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo
          id={product.id}
          name={product.name}
          slug={product.slug}
          description={product.description}
          price={Number(product.price)}
          stock={product.stock}
          category={product.category}
          image={product.images[0]}
        />
      </div>

      {/* Related products */}
      {relatedFiltered.length > 0 && (
        <div className="mt-16">
          <SectionHeader
            title="Productos relacionados"
            subtitle={`Más de ${product.category.name}`}
            className="mb-8"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedFiltered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={Number(p.price)}
                image={p.images[0]}
                category={p.category.name}
                stock={p.stock}
                featured={p.featured}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
