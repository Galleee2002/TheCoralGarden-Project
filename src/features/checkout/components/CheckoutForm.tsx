"use client";

import { useMemo, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/features/cart/store/cartStore";
import { createOrder } from "@/features/checkout/actions/createOrder";
import { createMercadoPagoPreference } from "@/features/checkout/actions/createMercadoPagoPreference";
import {
  getShippingAgencies,
  quoteShipping,
} from "@/features/checkout/actions/shippingActions";
import { SHIPPING_DELIVERY_LABEL, ShippingDeliveryType } from "@/types/shipping";
import { toast } from "sonner";
import { Loader2, MapPin, Search, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  customerName: z.string().min(2, "Nombre requerido"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(6, "Teléfono requerido"),
  customerStreet: z.string().min(3, "Calle requerida"),
  customerStreetNumber: z.string().min(1, "Altura requerida"),
  customerFloor: z.string().optional(),
  customerApartment: z.string().optional(),
  customerCity: z.string().min(2, "Ciudad requerida"),
  customerProvince: z.string().min(2, "Provincia requerida"),
  customerZip: z.string().min(3, "Código postal requerido"),
});

type FormValues = z.infer<typeof formSchema>;

type ShippingRate = {
  deliveredType: ShippingDeliveryType;
  productType: string;
  productName: string;
  price: number;
  deliveryTimeMin: string | null;
  deliveryTimeMax: string | null;
  validTo: string | null;
};

type ShippingAgency = {
  code: string;
  name: string;
  address: string | null;
  city: string | null;
};

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [agencies, setAgencies] = useState<ShippingAgency[]>([]);
  const [selectedAgencyCode, setSelectedAgencyCode] = useState("");
  const [agencySearch, setAgencySearch] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerStreet: "",
      customerStreetNumber: "",
      customerFloor: "",
      customerApartment: "",
      customerCity: "",
      customerProvince: "",
      customerZip: "",
    },
  });

  const shippingCost = selectedRate?.price ?? 0;
  const total = subtotal() + shippingCost;

  const selectedAgency = agencies.find(
    (agency) => agency.code === selectedAgencyCode
  );

  const normalizedAgencySearch = agencySearch.trim().toLowerCase();
  const hasManyAgencies = agencies.length > 50;

  const filteredAgencies = useMemo(() => {
    if (agencies.length === 0) return [];

    if (!normalizedAgencySearch) {
      return hasManyAgencies ? agencies.slice(0, 50) : agencies;
    }

    return agencies
      .filter((agency) => {
        const haystack = [
          agency.name,
          agency.address ?? "",
          agency.city ?? "",
          agency.code,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedAgencySearch);
      })
      .slice(0, 100);
  }, [agencies, hasManyAgencies, normalizedAgencySearch]);

  const handleQuote = async () => {
    const valid = await form.trigger([
      "customerZip",
      "customerProvince",
      "customerStreet",
      "customerStreetNumber",
      "customerCity",
    ]);

    if (!valid) return;

    setQuoting(true);
    setSelectedRate(null);
    setSelectedAgencyCode("");
    setAgencies([]);

    const result = await quoteShipping({
      customerZip: form.getValues("customerZip"),
    });
    setQuoting(false);

    if (result?.data?.rates?.length) {
      setRates(result.data.rates);
    } else {
      setRates([]);
      toast.error(result?.serverError ?? "No se pudo cotizar el envío");
    }
  };

  const handleSelectRate = async (rate: ShippingRate) => {
    setSelectedRate(rate);
    setSelectedAgencyCode("");
    setAgencySearch("");

    if (rate.deliveredType !== ShippingDeliveryType.AGENCY) {
      return;
    }

    setLoadingAgencies(true);
    const result = await getShippingAgencies({
      customerProvince: form.getValues("customerProvince"),
    });
    setLoadingAgencies(false);

    if (result?.data?.agencies?.length) {
      setAgencies(result.data.agencies);
    } else {
      setAgencies([]);
      toast.error(result?.serverError ?? "No se pudieron cargar sucursales");
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!selectedRate) {
      toast.error("Calculá y seleccioná un envío antes de pagar");
      return;
    }

    if (
      selectedRate.deliveredType === ShippingDeliveryType.AGENCY &&
      !selectedAgency
    ) {
      toast.error("Seleccioná una sucursal de Correo Argentino");
      return;
    }

    setLoading(true);
    try {
      const orderResult = await createOrder({
        ...values,
        shippingDeliveryType: selectedRate.deliveredType,
        shippingProductType: selectedRate.productType,
        shippingProductName: selectedRate.productName,
        shippingCost: selectedRate.price,
        shippingAgency: selectedAgency?.code,
        shippingAgencyName: selectedAgency?.name,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      if (!orderResult?.data?.orderId) {
        toast.error(orderResult?.serverError ?? "Error al crear la orden");
        return;
      }

      const mpResult = await createMercadoPagoPreference({
        orderId: orderResult.data.orderId,
      });

      if (!mpResult?.data?.initPoint) {
        toast.error(mpResult?.serverError ?? "Error al procesar el pago");
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
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-xl font-semibold">Datos de envío</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                        autoComplete="email"
                        spellCheck={false}
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
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+54 9 11..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-line1" placeholder="Av. Corrientes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerStreetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerFloor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Piso</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerApartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
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
                      <Input autoComplete="address-level2" placeholder="Buenos Aires" {...field} />
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
                      <Input autoComplete="address-level1" placeholder="Buenos Aires" {...field} />
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
                      <Input
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="1001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-card border border-border/50 bg-card-light p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">Correo Argentino</h3>
                    <p className="text-sm text-muted-foreground">
                      Cotizá domicilio y sucursal antes de crear la orden.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleQuote}
                    disabled={quoting || loading}
                  >
                    {quoting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                    Calcular envío
                  </Button>
                </div>

                {rates.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rates.map((rate) => {
                      const active =
                        selectedRate?.deliveredType === rate.deliveredType &&
                        selectedRate?.productType === rate.productType;
                      return (
                        <button
                          key={`${rate.deliveredType}-${rate.productType}`}
                          type="button"
                          onClick={() => handleSelectRate(rate)}
                          className={cn(
                            "rounded-card border bg-background p-4 text-left transition",
                            active
                              ? "border-btn-primary ring-2 ring-btn-primary/20"
                              : "border-border/60 hover:border-btn-primary"
                          )}
                        >
                          <span className="flex items-center gap-2 font-semibold text-text-primary">
                            <MapPin className="h-4 w-4" />
                            {SHIPPING_DELIVERY_LABEL[rate.deliveredType]}
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            {rate.productName}
                          </span>
                          <span className="mt-3 block text-lg font-bold text-text-primary">
                            {formatPrice(rate.price)}
                          </span>
                          {rate.deliveryTimeMin && rate.deliveryTimeMax && (
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {rate.deliveryTimeMin} a {rate.deliveryTimeMax} días hábiles
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedRate?.deliveredType === ShippingDeliveryType.AGENCY && (
                  <div className="flex flex-col gap-2">
                    <FormLabel>Sucursal de retiro</FormLabel>
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={agencySearch}
                        onChange={(event) => setAgencySearch(event.target.value)}
                        placeholder="Buscar por nombre, dirección, ciudad o código"
                        className="bg-background pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {filteredAgencies.length} resultado
                      {filteredAgencies.length === 1 ? "" : "s"}
                      {normalizedAgencySearch
                        ? ` para "${agencySearch.trim()}"`
                        : hasManyAgencies
                          ? ` de ${agencies.length}. Escribí para acotar.`
                          : " disponibles"}
                    </p>
                    <Select
                      value={selectedAgencyCode}
                      onValueChange={setSelectedAgencyCode}
                      disabled={loadingAgencies || filteredAgencies.length === 0}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder={
                            loadingAgencies
                              ? "Cargando sucursales..."
                              : filteredAgencies.length > 0
                                ? "Seleccioná una sucursal"
                                : "Sin resultados"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
                        <ScrollArea className="max-h-72">
                          {filteredAgencies.length > 0 ? (
                            filteredAgencies.map((agency) => (
                              <SelectItem key={agency.code} value={agency.code}>
                                {agency.name}
                                {agency.address ? ` - ${agency.address}` : ""}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-3 text-sm text-muted-foreground">
                              No encontramos sucursales con esa búsqueda.
                            </div>
                          )}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    {selectedAgency && (
                      <div className="rounded-button border border-border/60 bg-background/70 p-3 text-sm">
                        <p className="font-medium text-text-primary">{selectedAgency.name}</p>
                        {selectedAgency.address && (
                          <p className="text-muted-foreground">{selectedAgency.address}</p>
                        )}
                        {selectedAgency.city && (
                          <p className="text-muted-foreground">{selectedAgency.city}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pagar con MercadoPago - {formatPrice(total)}
            </Button>
          </form>
        </Form>
      </div>

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
                    <p className="text-muted-foreground">x {item.quantity}</p>
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
            <span>
              {selectedRate ? formatPrice(selectedRate.price) : "Pendiente"}
            </span>
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
