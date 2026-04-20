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
import type { OrderStatus } from "@/types/enums";
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
  shippingImportStatus: string | null;
  shippingTrackingNumber: string | null;
  shippingImportError: string | null;
  total: number;
  createdAt: Date;
};

interface OrdersTableProps {
  orders: Order[];
}

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(d);

function getShippingLabel(order: Order) {
  if (order.shippingImportStatus === "IMPORTED") {
    return order.shippingTrackingNumber
      ? `Importado · Tracking ${order.shippingTrackingNumber}`
      : "Importado";
  }

  if (order.shippingImportStatus === "FAILED") {
    return order.shippingImportError
      ? `Falló: ${order.shippingImportError}`
      : "Falló la importación";
  }

  return "Pendiente de importación";
}

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
                <div className="mt-3 rounded-dropdown bg-card-light p-3 text-sm">
                  <p className="text-muted-foreground">Envío Correo</p>
                  <p className="font-medium text-text-primary">{getShippingLabel(order)}</p>
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
                <TableHead className="w-[16%]">Envío</TableHead>
                <TableHead className="w-[12%]">Total</TableHead>
                <TableHead className="w-[15%]">Fecha</TableHead>
                <TableHead className="w-[12%] text-right">Acciones</TableHead>
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
                      <p className="text-sm text-text-primary">{getShippingLabel(order)}</p>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DeleteOrderButton
                          orderId={order.id}
                          customerName={order.customerName}
                          showLabel={false}
                          className="px-3"
                        />
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
