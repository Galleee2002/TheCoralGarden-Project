"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCartStore } from "@/features/cart/store/cartStore";
import { toast } from "sonner";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  featured?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  category,
  stock,
  featured,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: id,
      name,
      price,
      image: image ?? "",
      slug,
    });
    toast.success(`${name} agregado al carrito`);
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(p);

  return (
    <Link href={`/productos/${slug}`} className="group">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
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
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {featured && (
              <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">
                Destacado
              </Badge>
            )}
            {stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Badge variant="secondary">Sin stock</Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4">
          {category && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {category}
            </p>
          )}
          <h3 className="font-semibold leading-tight text-foreground">
            {name}
          </h3>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
