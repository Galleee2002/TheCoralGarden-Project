import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { FeriaForm } from "@/features/admin/components/ferias/FeriaForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Nueva Feria" };

export default function NuevaFeriaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nueva feria"
        description="Completá los datos para publicar una nueva feria"
      />
      <FeriaForm mode="create" />
    </div>
  );
}
