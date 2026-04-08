"use client";

import { useFavoritesStore } from "@/features/favorites/store/favoritesStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Trash2, ShoppingCart, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format-price";

export default function FavoritosPage() {
  const { items, toggleFavorite } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <Heart className="h-20 w-20 text-muted-foreground" />
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Tu lista de favoritos está vacía
        </h1>
        <p className="text-muted-foreground">
          Explorá nuestros productos y guardá los que más te gusten.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-btn-primary text-text-secondary hover:bg-btn-primary-hover"
        >
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-2 font-heading text-3xl font-bold text-text-primary">
        Mis Favoritos
      </h1>
      <p className="mb-8 text-muted-foreground">
        {items.length}{" "}
        {items.length === 1 ? "producto guardado" : "productos guardados"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col overflow-hidden rounded-card border border-border/30 bg-card shadow-sm"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-card-light">
                  <PackageSearch className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-heading text-lg font-bold leading-tight text-text-primary">
                {item.name}
              </h3>
              <p className="mt-2 text-xl font-bold text-btn-primary">
                {formatPrice(item.price)}
              </p>

              <Separator className="my-3" />

              <div className="mt-auto flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-btn-primary text-btn-primary hover:bg-btn-primary hover:text-text-secondary"
                >
                  <Link href={`/productos/${item.slug}`}>Ver producto</Link>
                </Button>

                <Button
                  className="w-full bg-btn-primary text-text-secondary hover:bg-btn-primary-hover"
                  onClick={() => {
                    addItem({
                      productId: item.productId,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      slug: item.slug,
                    });
                    toast.success(`${item.name} agregado al carrito`);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar al carrito
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    toggleFavorite(item);
                    toast.success(`${item.name} eliminado de favoritos`);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Quitar de favoritos
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
