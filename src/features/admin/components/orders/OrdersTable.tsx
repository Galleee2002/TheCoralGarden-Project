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
import type { OrderStatus } from "@/types/enums";

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
  total: number | { toString(): string };
  createdAt: Date;
};

interface OrdersTableProps {
  orders: Order[];
}

const formatPrice = (p: number | { toString(): string }) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(p));

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(d);

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <EmptyState colSpan={5} message="No hay órdenes todavía" />
        ) : (
          orders.map((order) => {
            const { variant, label } = orderStatusVariant[order.status];
            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}…
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <StatusBadge variant={variant} label={label} />
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
