"use client";

import { useState, useTransition } from "react";
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
import { CategoryDialog } from "./CategoryDialog";
import { deleteCategory } from "@/features/admin/actions/categoryActions";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

interface CategoryManagerClientProps {
  categories: Category[];
}

type DialogState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; category: Category };

type DeleteState = { id: string; name: string } | null;

export function CategoryManagerClient({ categories: initial }: CategoryManagerClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [dialog, setDialog] = useState<DialogState>({ type: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<DeleteState>(null);
  const [isDeleting, startDelete] = useTransition();

  const handleCreated = (cat: { id: string; name: string; slug: string }) => {
    setCategories((prev) => [
      ...prev,
      { ...cat, description: null, _count: { products: 0 } },
    ]);
    router.refresh();
  };

  const handleUpdated = (cat: { id: string; name: string; slug: string }) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, ...cat } : c)),
    );
    router.refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteCategory({ id: deleteTarget.id });
      if (result?.data?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        toast.success("Categoría eliminada");
        router.refresh();
      } else {
        toast.error("No se pudo eliminar la categoría");
      }
      setDeleteTarget(null);
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setDialog({ type: "create" })}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      <div
        role="region"
        aria-label="Tabla de categorías"
        className="overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <EmptyState colSpan={5} message="No hay categorías cargadas" />
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="max-w-[240px] truncate text-muted-foreground">
                    {cat.description ?? "—"}
                  </TableCell>
                  <TableCell>{cat._count.products}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDialog({ type: "edit", category: cat })}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() =>
                          setDeleteTarget({ id: cat.id, name: cat.name })
                        }
                        disabled={cat._count.products > 0}
                        title={
                          cat._count.products > 0
                            ? "No se puede eliminar: tiene productos asociados"
                            : undefined
                        }
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

      {/* Create/Edit dialog */}
      <CategoryDialog
        open={dialog.type !== "closed"}
        onOpenChange={(open) => !open && setDialog({ type: "closed" })}
        mode={dialog.type === "edit" ? "edit" : "create"}
        defaultValues={
          dialog.type === "edit"
            ? {
                ...dialog.category,
                description: dialog.category.description ?? undefined,
              }
            : undefined
        }
        onSuccess={dialog.type === "edit" ? handleUpdated : handleCreated}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar categoría"
        description={`¿Estás seguro de que querés eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}
