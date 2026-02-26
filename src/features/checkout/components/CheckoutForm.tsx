"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store/cartStore";
import { createOrder } from "@/features/checkout/actions/createOrder";
import { createMercadoPagoPreference } from "@/features/checkout/actions/createMercadoPagoPreference";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(6, "Teléfono requerido"),
  customerStreet: z.string().min(3, "Dirección requerida"),
  customerCity: z.string().min(2, "Ciudad requerida"),
  customerProvince: z.string().min(2, "Provincia requerida"),
  customerZip: z.string().min(3, "Código postal requerido"),
});

type FormValues = z.infer<typeof formSchema>;

const SHIPPING_COST = 0; // Free shipping or calculated later

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerStreet: "",
      customerCity: "",
      customerProvince: "",
      customerZip: "",
    },
  });

  const total = subtotal() + SHIPPING_COST;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(p);

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    setLoading(true);
    try {
      const orderResult = await createOrder({
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingCost: SHIPPING_COST,
      });

      if (!orderResult?.data?.orderId) {
        toast.error("Error al crear la orden");
        return;
      }

      const mpResult = await createMercadoPagoPreference({
        orderId: orderResult.data.orderId,
      });

      if (!mpResult?.data?.initPoint) {
        toast.error("Error al procesar el pago");
        return;
      }

      clearCart();
      window.location.href = mpResult.data.initPoint;
    } catch {
      toast.error("Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">El carrito está vacío</h2>
        <Button asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-xl font-semibold">Datos de envío</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan García" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="juan@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+54 9 11 ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerStreet"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Calle y número</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Corrientes 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Buenos Aires" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Buenos Aires" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal</FormLabel>
                    <FormControl>
                      <Input placeholder="1001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pagar con MercadoPago — {formatPrice(total)}
            </Button>
          </form>
        </Form>
      </div>

      {/* Order summary */}
      <div>
        <div className="sticky top-24 rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Tu pedido</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal())}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Envío</span>
            <span>{SHIPPING_COST === 0 ? "Gratis" : formatPrice(SHIPPING_COST)}</span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
