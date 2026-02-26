"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductInfoProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: { name: string };
  image?: string;
}

export function ProductInfo({
  id,
  name,
  slug,
  description,
  price,
  stock,
  category,
  image,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ productId: id, name, price, image: image ?? "", slug });
    }
    toast.success(`${quantity} × ${name} agregado al carrito`);
    setQuantity(1);
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(p);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge variant="secondary" className="mb-3">
          {category.name}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      </div>

      <div className="text-3xl font-bold text-primary">{formatPrice(price)}</div>

      <p className="leading-relaxed text-muted-foreground">{description}</p>

      <div className="flex items-center gap-2">
        {stock > 0 ? (
          <Badge className="bg-green-100 text-green-800">
            En stock ({stock} disponibles)
          </Badge>
        ) : (
          <Badge variant="destructive">Sin stock</Badge>
        )}
      </div>

      {stock > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-lg font-semibold">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            size="lg"
            className="flex-1 gap-2 sm:flex-none sm:px-8"
          >
            <ShoppingCart className="h-5 w-5" />
            Agregar al carrito
          </Button>
        </div>
      )}
    </div>
  );
}
