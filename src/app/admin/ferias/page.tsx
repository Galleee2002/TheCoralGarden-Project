import { getFerias } from "@/features/ferias/actions/feriaActions";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { FeriasManagerClient } from "@/features/admin/components/ferias/FeriasManagerClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Ferias" };

export default async function AdminFeriasPage() {
  const ferias = await getFerias();

  return (
    <div>
      <AdminPageHeader
        title="Ferias"
        description="Gestioná las ferias y eventos del negocio"
      />
      <FeriasManagerClient ferias={ferias} />
    </div>
  );
}
