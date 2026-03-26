import { notFound } from "next/navigation";
import { getFeriaById } from "@/features/ferias/actions/feriaActions";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { FeriaForm } from "@/features/admin/components/ferias/FeriaForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Editar Feria" };

interface EditarFeriaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarFeriaPage({ params }: EditarFeriaPageProps) {
  const { id } = await params;
  const feria = await getFeriaById(id);

  if (!feria) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Editar feria"
        description={`Editando: ${feria.title}`}
      />
      <FeriaForm
        mode="edit"
        defaultValues={{
          id: feria.id,
          title: feria.title,
          description: feria.description,
          imageUrl: feria.imageUrl,
          date: feria.date.toISOString().split("T")[0],
        }}
      />
    </div>
  );
}
