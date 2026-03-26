"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { deleteFeria } from "@/features/ferias/actions/feriaActions";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Feria {
  id: string;
  title: string;
  imageUrl: string;
  date: Date;
}

interface FeriasManagerClientProps {
  ferias: Feria[];
}

type DeleteState = { id: string; title: string } | null;

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" });

export function FeriasManagerClient({ ferias: initial }: FeriasManagerClientProps) {
  const router = useRouter();
  const [ferias, setFerias] = useState(initial);
  const [deleteTarget, setDeleteTarget] = useState<DeleteState>(null);
  const [isDeleting, startDelete] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteFeria({ id: deleteTarget.id });
      if (result?.data?.success) {
        setFerias((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        toast.success("Feria eliminada");
        router.refresh();
      } else {
        toast.error("No se pudo eliminar la feria");
      }
      setDeleteTarget(null);
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/admin/ferias/nueva">
            <Plus className="mr-2 h-4 w-4" />
            Nueva feria
          </Link>
        </Button>
      </div>

      <div
        role="region"
        aria-label="Tabla de ferias"
        className="overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-16">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferias.length === 0 ? (
              <EmptyState colSpan={4} message="No hay ferias cargadas todavía" />
            ) : (
              ferias.map((feria) => (
                <TableRow key={feria.id}>
                  <TableCell>
                    <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border">
                      <Image
                        src={feria.imageUrl}
                        alt={feria.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{feria.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(feria.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/ferias/${feria.id}/editar`}>
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-white hover:border-destructive [&>svg]:hover:text-white"
                        onClick={() => setDeleteTarget({ id: feria.id, title: feria.title })}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar feria"
        description={`¿Estás seguro de que querés eliminar "${deleteTarget?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}
