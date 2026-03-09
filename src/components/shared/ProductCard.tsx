import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(p);

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

        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-heading text-xl font-bold leading-tight text-text-primary md:text-2xl">
            {name}
          </h3>
          {description && (
            <p className="line-clamp-2 text-sm text-text-primary/70">
              {description}
            </p>
          )}
          <span className="mt-auto text-sm text-text-primary/60">
            Precio:{" "}
            <span className="font-bold text-text-primary">{formatPrice(price)}</span>
          </span>
          <div className="flex items-center justify-center gap-2 rounded-button bg-btn-primary px-4 py-2 text-sm font-medium text-text-secondary">
            Ver más <ChevronRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
