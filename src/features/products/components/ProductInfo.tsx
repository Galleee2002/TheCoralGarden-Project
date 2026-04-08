"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useFavoritesStore } from "@/features/favorites/store/favoritesStore";
import { CheckCircle2, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: { name: string };
  image?: string;
  specifications?: string[];
}

export function ProductInfo({
  id,
  name,
  slug,
  description,
  price,
  stock,
  image,
  specifications = [],
}: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(id));

  const handleBuyNow = () => {
    addItem({ productId: id, name, price, image: image ?? "", slug });
    router.push("/carrito");
  };

  const handleAddToCart = () => {
    addItem({ productId: id, name, price, image: image ?? "", slug });
    toast.success(`${name} agregado al carrito`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite({ productId: id, name, price, image: image ?? "", slug });
    if (isFavorite) {
      toast.info("Eliminado de favoritos");
    } else {
      toast.success("Agregado a favoritos");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title + Price row */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl md:text-4xl">{name}</h1>
        <span className="font-heading text-3xl font-bold whitespace-nowrap">
          {formatPrice(price)}
        </span>
      </div>

      <hr className="border-border/40" />

      {/* Description */}
      <h2 className="font-heading text-2xl font-bold">
        Descripción del producto
      </h2>
      <p className="text-muted-foreground text-base leading-relaxed">
        {description}
      </p>

      {/* Specifications */}
      {specifications.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-bold">Especificaciones</h2>
          <div className="grid grid-cols-2 gap-3">
            {specifications.map((spec, i) => (
              <div key={i} className="border-border/30 flex items-center gap-2 rounded-lg border p-3 text-sm">
                <CheckCircle2 className="text-text-primary h-4 w-4 shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA row */}
      {stock > 0 ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBuyNow}
            size="lg"
            className="bg-btn-primary text-text-secondary hover:bg-btn-primary-hover flex-1"
          >
            Comprar ahora
          </Button>

          <Button
            size="icon"
            onClick={handleToggleFavorite}
            aria-label="Favoritos"
            className="bg-card-light hover:bg-card-light/80 border-0"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-bg-secondary"
              )}
            />
          </Button>

          <Button
            size="icon"
            onClick={handleAddToCart}
            className="bg-card-light hover:bg-card-light/80 border-0"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="h-5 w-5 text-bg-secondary" />
          </Button>
        </div>
      ) : (
        <p className="text-destructive text-sm font-medium">Sin stock</p>
      )}
    </div>
  );
}
