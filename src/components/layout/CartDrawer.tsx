"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-5 w-5" />
            Carrito de compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center px-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button asChild onClick={onClose}>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">
                          {item.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t px-6 py-5 bg-muted/30">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold">
                  {formatPrice(subtotal())}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Button asChild className="w-full h-11 bg-btn-primary text-white hover:bg-btn-primary-hover" onClick={onClose}>
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11"
                  asChild
                  onClick={onClose}
                >
                  <Link href="/carrito">Ver carrito completo</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
