import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug } from "@/features/products/actions/getProductBySlug";
import { getProducts } from "@/features/products/actions/getProducts";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { ProductInfo } from "@/features/products/components/ProductInfo";
import { ProductCard } from "@/components/shared/ProductCard";
import { MiniBanner } from "@/features/home/components/MiniBanner";
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

  const { products: sameCategory } = await getProducts({
    categorySlug: product.category.slug,
    pageSize: 5,
  });

  let relatedFiltered = sameCategory.filter((p) => p.id !== product.id).slice(0, 4);

  if (relatedFiltered.length < 4) {
    const { products: others } = await getProducts({ pageSize: 8 });
    const otherFiltered = others.filter(
      (p) => p.id !== product.id && !relatedFiltered.some((r) => r.id === p.id),
    );
    relatedFiltered = [...relatedFiltered, ...otherFiltered].slice(0, 4);
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/productos" className="hover:text-foreground transition-colors">
            Productos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Product detail grid */}
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
            specifications={product.specifications}
          />
        </div>

        {/* Related products */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            {/* Section header */}
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <h2 className="font-heading text-[40px] leading-none md:text-[64px]">
                  PRODUCTOS RELACIONADOS
                </h2>
                <Link
                  href="/productos"
                  className="flex items-center gap-1 text-sm font-medium text-btn-primary hover:underline"
                >
                  Ver productos <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-base text-muted-foreground">
                Explore nuestra variedad de productos
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedFiltered.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={Number(p.price)}
                  image={p.images[0]}
                  stock={p.stock}
                  description={p.description}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MiniBanner before footer */}
      <div className="mt-16">
        <MiniBanner />
      </div>
    </div>
  );
}
