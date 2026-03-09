import { getOrders } from "@/features/admin/actions/getOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import type { OrderStatus } from "@/types/enums";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Órdenes" };

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:    { label: "Pendiente",  className: "bg-amber-100 text-amber-800 border border-amber-200" },
  PAID:       { label: "Pagado",     className: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  PROCESSING: { label: "En proceso", className: "bg-blue-100 text-blue-800 border border-blue-200" },
  SHIPPED:    { label: "Enviado",    className: "bg-violet-100 text-violet-800 border border-violet-200" },
  DELIVERED:  { label: "Entregado",  className: "bg-card-light text-text-primary border border-border" },
  CANCELLED:  { label: "Cancelado",  className: "bg-destructive/10 text-destructive border border-destructive/20" },
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
      <AdminPageHeader title="Órdenes" description="Historial de pedidos" />
      <div
        role="region"
        aria-label="Tabla de órdenes"
        className="overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
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
                const status = statusStyles[order.status];
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
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          status.className,
                        ].join(" ")}
                      >
                        {status.label}
                      </span>
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
