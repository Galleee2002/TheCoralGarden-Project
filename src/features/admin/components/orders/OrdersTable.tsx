"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { DeleteOrderButton } from "./DeleteOrderButton";
import { ShippingActions } from "./ShippingActions";
import type { OrderStatus } from "@/types/enums";
import { SHIPPING_DELIVERY_LABEL, ShippingImportStatus } from "@/types/shipping";
import { formatPrice } from "@/lib/format-price";

const orderStatusVariant: Record<OrderStatus, { variant: Parameters<typeof StatusBadge>[0]["variant"]; label: string }> = {
  PENDING:    { variant: "pending",    label: "Pendiente" },
  PAID:       { variant: "paid",       label: "Pagado" },
  PROCESSING: { variant: "processing", label: "En proceso" },
  SHIPPED:    { variant: "shipped",    label: "Enviado" },
  DELIVERED:  { variant: "delivered",  label: "Entregado" },
  CANCELLED:  { variant: "cancelled",  label: "Cancelado" },
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  shippingCarrier: string | null;
  shippingDeliveryType: string | null;
  shippingProductName: string | null;
  shippingAgencyName: string | null;
  shippingImportStatus: string | null;
  shippingImportError: string | null;
  shippingTrackingNumber: string | null;
  shippingTrackingLastEvent: string | null;
  shippingTrackingLastSyncAt: Date | null;
};

interface OrdersTableProps {
  orders: Order[];
}

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(d);

const shippingStatusVariant = (status: string | null) => {
  if (status === ShippingImportStatus.IMPORTED) {
    return { variant: "paid" as const, label: "Importado" };
  }
  if (status === ShippingImportStatus.ERROR) {
    return { variant: "blocked" as const, label: "Error import" };
  }
  return { variant: "pending" as const, label: "Pendiente" };
};

const deliveryLabel = (value: string | null) =>
  value === "D" || value === "S" ? SHIPPING_DELIVERY_LABEL[value] : "Sin definir";

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div>
      <div className="space-y-3 lg:hidden">
        {orders.length === 0 ? (
          <div className="rounded-card border border-border/50 bg-card p-6 text-center text-muted-foreground shadow-sm">
            No hay órdenes todavía
          </div>
        ) : (
          orders.map((order) => {
            const { variant, label } = orderStatusVariant[order.status];
            return (
              <article
                key={order.id}
                className="rounded-card border border-border/50 bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8)}</p>
                    <p className="mt-1 text-base font-semibold text-text-primary break-words">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground break-words">
                      {order.customerEmail}
                    </p>
                  </div>
                  <StatusBadge variant={variant} label={label} />
                </div>

                <div className="mt-4 rounded-dropdown bg-card-light p-3">
                  <p className="text-xs font-medium text-muted-foreground">Gestión</p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      triggerClassName="min-h-11 w-full bg-background sm:flex-1"
                    />
                    <DeleteOrderButton
                      orderId={order.id}
                      customerName={order.customerName}
                      className="w-full justify-center sm:w-auto sm:px-4"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-dropdown bg-card-light p-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold text-text-primary">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha</p>
                    <p className="font-medium text-text-primary">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-dropdown bg-card-light p-3 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">Logistica</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        variant={shippingStatusVariant(order.shippingImportStatus).variant}
                        label={shippingStatusVariant(order.shippingImportStatus).label}
                      />
                      <span className="text-muted-foreground">
                        {deliveryLabel(order.shippingDeliveryType)}
                      </span>
                    </div>
                    <p className="text-text-primary">
                      {order.shippingTrackingNumber ?? "Tracking pendiente"}
                    </p>
                    {order.shippingImportError && (
                      <p className="text-destructive">{order.shippingImportError}</p>
                    )}
                    <ShippingActions
                      orderId={order.id}
                      canRetryImport={order.shippingImportStatus === ShippingImportStatus.ERROR}
                      canRefreshTracking={order.shippingImportStatus === ShippingImportStatus.IMPORTED}
                    />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden lg:block">
        <Table className="min-w-[980px]">
          <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[12%]">ID</TableHead>
                <TableHead className="w-[25%]" noWrap={false}>Cliente</TableHead>
                <TableHead className="w-[24%]" noWrap={false}>Estado</TableHead>
                <TableHead className="w-[22%]" noWrap={false}>Logistica</TableHead>
                <TableHead className="w-[12%]">Total</TableHead>
                <TableHead className="w-[15%]">Fecha</TableHead>
                <TableHead className="w-[18%] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <EmptyState colSpan={7} message="No hay órdenes todavía" />
            ) : (
              orders.map((order) => {
                const { variant, label } = orderStatusVariant[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}…
                    </TableCell>
                    <TableCell noWrap={false}>
                      <div>
                        <p className="font-medium break-words">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground break-words">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell noWrap={false}>
                      <div className="flex min-w-[240px] flex-col gap-2">
                        <StatusBadge variant={variant} label={label} />
                        <OrderStatusSelect
                          orderId={order.id}
                          currentStatus={order.status}
                          triggerClassName="min-h-10 w-full bg-background"
                        />
                      </div>
                    </TableCell>
                    <TableCell noWrap={false}>
                      <div className="flex min-w-[260px] flex-col gap-2 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            variant={shippingStatusVariant(order.shippingImportStatus).variant}
                            label={shippingStatusVariant(order.shippingImportStatus).label}
                          />
                          <span className="text-muted-foreground">
                            {deliveryLabel(order.shippingDeliveryType)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {order.shippingProductName ?? "Correo Argentino"}
                          </p>
                          {order.shippingAgencyName && (
                            <p className="text-xs text-muted-foreground">
                              {order.shippingAgencyName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {order.shippingTrackingNumber ?? "Tracking pendiente"}
                          </p>
                          {order.shippingTrackingLastEvent && (
                            <p className="text-xs text-muted-foreground">
                              Ultimo evento: {order.shippingTrackingLastEvent}
                            </p>
                          )}
                          {order.shippingTrackingLastSyncAt && (
                            <p className="text-xs text-muted-foreground">
                              Sync: {formatDate(order.shippingTrackingLastSyncAt)}
                            </p>
                          )}
                          {order.shippingImportError && (
                            <p className="text-xs text-destructive">
                              {order.shippingImportError}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <div className="flex flex-col items-end gap-2">
                          <ShippingActions
                            orderId={order.id}
                            canRetryImport={order.shippingImportStatus === ShippingImportStatus.ERROR}
                            canRefreshTracking={order.shippingImportStatus === ShippingImportStatus.IMPORTED}
                          />
                          <DeleteOrderButton
                            orderId={order.id}
                            customerName={order.customerName}
                            showLabel={false}
                            className="px-3"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
