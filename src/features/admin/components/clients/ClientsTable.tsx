"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { OrderStatus } from "@/types/enums";
import { SHIPPING_DELIVERY_LABEL } from "@/types/shipping";
import { formatPrice } from "@/lib/format-price";
import type {
  CustomerOrderLineItem,
  CustomerOrderSummary,
  CustomerRow,
} from "@/features/admin/actions/getCustomers";

interface ClientsTableProps {
  customers: CustomerRow[];
}

const orderStatusVariant: Record<
  OrderStatus,
  { variant: Parameters<typeof StatusBadge>[0]["variant"]; label: string }
> = {
  PENDING: { variant: "pending", label: "Pendiente" },
  PAID: { variant: "paid", label: "Pagado" },
  PROCESSING: { variant: "processing", label: "En proceso" },
  SHIPPED: { variant: "shipped", label: "Enviado" },
  DELIVERED: { variant: "delivered", label: "Entregado" },
  CANCELLED: { variant: "cancelled", label: "Cancelado" },
};

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);

const deliveryLabel = (value: string | null) =>
  value === "D" || value === "S" ? SHIPPING_DELIVERY_LABEL[value] : value ?? "—";

function OrderItemsTable({ items }: { items: CustomerOrderLineItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Sin ítems en esta orden.</p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto rounded-md border border-border/50">
      <Table className="min-w-[640px] text-sm">
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="w-[120px]">ID producto</TableHead>
            <TableHead className="w-[72px] text-center">Cant.</TableHead>
            <TableHead className="w-[100px] text-right">P. unit.</TableHead>
            <TableHead className="w-[100px] text-right">Subtotal línea</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((line) => (
            <TableRow key={line.orderItemId}>
              <TableCell noWrap={false}>
                <Link
                  href={`/productos/${line.productSlug}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {line.productName}
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  Ítem orden: {line.orderItemId.slice(0, 8)}…
                </p>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {line.productId.slice(0, 12)}…
              </TableCell>
              <TableCell className="text-center tabular-nums">{line.quantity}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPrice(line.unitPrice)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatPrice(line.lineTotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderDetailBlock({ order }: { order: CustomerOrderSummary }) {
  const status = orderStatusVariant[order.status];

  return (
    <div className="rounded-card border border-border/50 bg-card p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">
            Orden #{order.orderId}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Creada: {formatDate(order.createdAt)} · Actualizada:{" "}
            {formatDate(order.updatedAt)}
          </p>
        </div>
        <StatusBadge variant={status.variant} label={status.label} />
      </div>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Subtotal productos</p>
          <p className="font-medium tabular-nums">{formatPrice(order.subtotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Costo envío</p>
          <p className="font-medium tabular-nums">{formatPrice(order.shippingCost)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total orden</p>
          <p className="font-semibold tabular-nums">{formatPrice(order.total)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Método de envío (código)</p>
          <p className="break-all font-medium">{order.shippingMethod}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tipo entrega</p>
          <p className="font-medium">{deliveryLabel(order.shippingDeliveryType)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Transportista</p>
          <p className="font-medium">{order.shippingCarrier ?? "—"}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-muted-foreground">Servicio / sucursal</p>
          <p className="font-medium">
            {order.shippingProductName ?? "—"}
            {order.shippingAgencyName ? ` · ${order.shippingAgencyName}` : ""}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tracking</p>
          <p className="font-mono text-xs break-all">
            {order.shippingTrackingNumber ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Import envío (CA)</p>
          <p className="text-xs">{order.shippingImportStatus ?? "—"}</p>
          {order.shippingImportError && (
            <p className="mt-1 text-xs text-destructive">{order.shippingImportError}</p>
          )}
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs text-muted-foreground">Mercado Pago</p>
          <p className="font-mono text-[11px] break-all">
            Pago: {order.mpPaymentId ?? "—"}
          </p>
          <p className="font-mono text-[11px] break-all">
            Preferencia: {order.mpPreferenceId ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">Productos</p>
        <OrderItemsTable items={order.items} />
      </div>
    </div>
  );
}

export function ClientsTable({ customers }: ClientsTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-card border border-border/50 bg-card p-6 text-center text-muted-foreground shadow-sm">
        No hay clientes con órdenes todavía
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {customers.map((customer) => {
        const status = orderStatusVariant[customer.lastStatus];

        return (
          <AccordionItem key={customer.email} value={customer.email}>
            <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
              <div className="flex w-full flex-col gap-3 pr-2 text-left sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-text-primary break-words">
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground break-words">
                    {customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground break-words">
                    {customer.phone}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <StatusBadge variant={status.variant} label={status.label} />
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      <span className="font-medium text-text-primary">
                        {customer.ordersCount}
                      </span>{" "}
                      {customer.ordersCount === 1 ? "orden" : "órdenes"}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {formatPrice(customer.totalSpent)} total
                    </span>
                    <span className="text-xs sm:text-sm">
                      Última: {formatDate(customer.lastOrderAt)}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 border-t border-border/40 pt-2">
                <div className="rounded-dropdown bg-card-light p-3 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">
                    Dirección de envío (última orden registrada)
                  </p>
                  <p className="mt-2 text-text-primary">{customer.address}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Historial de órdenes y productos
                  </p>
                  <div className="flex flex-col gap-4">
                    {customer.orders.map((order) => (
                      <OrderDetailBlock key={order.orderId} order={order} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
