import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardSimpleProps {
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
}

export function ProductCardSimple({
  name,
  slug,
  price,
  image,
  description,
}: ProductCardSimpleProps) {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(p);

  return (
    <Link href={`/productos/${slug}`} className="group block">
      <div className="overflow-hidden rounded-card bg-card-default transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1 text-xl font-bold leading-tight text-text-primary md:text-3xl">
            {name}
          </h3>
          {description && (
            <p className="mb-2 line-clamp-2 text-base text-text-primary/60">
              {description}
            </p>
          )}
          <span className="text-lg font-bold text-text-primary">
            {formatPrice(price)}
          </span>
          <Button className="mt-2 w-full">Ver más</Button>
        </div>
      </div>
    </Link>
  );
}
