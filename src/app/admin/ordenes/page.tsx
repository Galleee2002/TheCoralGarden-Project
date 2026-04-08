import { getOrders } from "@/features/admin/actions/getOrders";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { OrdersTable } from "@/features/admin/components/orders/OrdersTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Órdenes" };

export default async function AdminOrdersPage() {
  const { orders } = await getOrders({ pageSize: 50 });

  return (
    <div>
      <AdminPageHeader title="Órdenes" description="Historial de pedidos" />
      <div
        role="region"
        aria-label="Tabla de órdenes"
        className="rounded-card border border-border/50 p-3 shadow-sm sm:p-4 lg:overflow-x-auto"
      >
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
