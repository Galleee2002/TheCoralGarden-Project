import { getOrders } from "@/features/admin/actions/getOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/enums";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Órdenes" };

const statusLabels: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  PAID: { label: "Pagado", variant: "default" },
  PROCESSING: { label: "En proceso", variant: "default" },
  SHIPPED: { label: "Enviado", variant: "default" },
  DELIVERED: { label: "Entregado", variant: "outline" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
};

export default async function AdminOrdersPage() {
  const { orders } = await getOrders({ pageSize: 50 });

  const formatPrice = (p: number | { toString(): string }) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(p));

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Órdenes</h1>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
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
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay órdenes todavía
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}…
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
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
