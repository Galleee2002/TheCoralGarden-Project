import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { getCustomers } from "@/features/admin/actions/getCustomers";
import { ClientsTable } from "@/features/admin/components/clients/ClientsTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Clientes" };

export default async function AdminClientesPage() {
  const { customers } = await getCustomers();

  return (
    <div>
      <AdminPageHeader
        title="Clientes"
        description="Abrí cada cliente para ver todas las órdenes, productos, cantidades y datos de envío y pago"
      />
      <div
        role="region"
        aria-label="Tabla de clientes"
        className="rounded-card border border-border/50 p-3 shadow-sm sm:p-4 lg:overflow-x-auto"
      >
        <ClientsTable customers={customers} />
      </div>
    </div>
  );
}
