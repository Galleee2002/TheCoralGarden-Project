import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
  stock: number;
}

export function ProductCard({
  name,
  slug,
  price,
  image,
  description,
  stock,
}: ProductCardProps) {
  return (
    <Link href={`/productos/${slug}`} className="group">
      <Card className="flex h-full flex-col overflow-hidden rounded-card border border-border/30 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card-light">
                <PackageSearch className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
{stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Badge variant="secondary">Sin stock</Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-lg font-bold leading-tight text-text-primary md:text-xl">
            {name}
          </h3>
          {description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-primary/60">
              {description}
            </p>
          )}
          <p className="mt-auto pt-4 text-2xl font-bold text-btn-primary">
            {formatPrice(price)}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-button bg-btn-primary px-4 py-2.5 text-sm font-medium text-text-secondary">
            Ver más <ChevronRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
