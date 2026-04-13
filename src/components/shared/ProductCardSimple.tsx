import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";

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
  return (
    <Link href={`/productos/${slug}`} className="group block h-full min-w-0">
      <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-card bg-card-default transition-shadow duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[5/4] overflow-hidden bg-card-light sm:aspect-[4/3]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card-light">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-3 min-h-[3.6rem] min-w-0 break-words font-heading text-xl leading-tight font-bold text-text-primary [overflow-wrap:anywhere] sm:min-h-[4.4rem] sm:text-[1.7rem] sm:leading-[0.95] lg:min-h-[4.7rem] lg:text-[2rem] lg:leading-[0.9]">
            {name}
          </h3>
          {description && (
            <p className="mt-2 line-clamp-2 min-h-[2.75rem] min-w-0 text-sm leading-relaxed text-text-primary/65 sm:mt-3 sm:min-h-[3.25rem] sm:text-base">
              {description}
            </p>
          )}
          <span className="mt-auto pt-3 text-base font-bold text-text-primary sm:pt-4 sm:text-lg">
            {formatPrice(price)}
          </span>
          <Button className="mt-3 w-full gap-2 text-sm sm:mt-4">
            Ver más
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
