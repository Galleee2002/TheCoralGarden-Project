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
        <Button
          onClick={() => setDialog({ type: "create" })}
          className="min-h-11 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Button>
      </div>

      <div role="region" aria-label="Categorías">
        <div className="space-y-3 lg:hidden">
          {categories.length === 0 ? (
            <div className="rounded-card border border-border/50 bg-card p-6 text-center text-muted-foreground shadow-sm">
              No hay categorías cargadas
            </div>
          ) : (
            categories.map((cat) => (
              <article
                key={cat.id}
                className="rounded-card border border-border/50 bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-text-primary break-words">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground break-words">
                      {cat.slug}
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-card-light px-2.5 py-1 text-xs font-semibold text-text-primary">
                    {cat._count.products} prod.
                  </span>
                </div>

                <div className="mt-4 rounded-dropdown bg-card-light p-3 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">Descripción</p>
                  <p className="mt-1 text-text-primary break-words">
                    {cat.description ?? "Sin descripción"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="min-h-11 flex-1 justify-center"
                    onClick={() => setDialog({ type: "edit", category: cat })}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11 flex-1 justify-center border-destructive/50 text-destructive hover:bg-destructive hover:text-white hover:border-destructive [&>svg]:hover:text-white"
                    onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto rounded-card border border-border/50 shadow-sm">
          <Table className="min-w-[940px]">
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[18%]" noWrap={false}>Nombre</TableHead>
                <TableHead className="w-[18%]" noWrap={false}>Slug</TableHead>
                <TableHead className="w-[34%]" noWrap={false}>Descripción</TableHead>
                <TableHead className="w-[10%]">Productos</TableHead>
                <TableHead className="w-[20%] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <EmptyState colSpan={5} message="No hay categorías cargadas" />
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium" noWrap={false}>
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground" noWrap={false}>
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground" noWrap={false}>
                      <p className="line-clamp-2 max-w-[360px]">{cat.description ?? "—"}</p>
                    </TableCell>
                    <TableCell>{cat._count.products}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-9"
                          onClick={() => setDialog({ type: "edit", category: cat })}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-9 text-destructive hover:bg-destructive hover:text-white hover:border-destructive [&>svg]:hover:text-white"
                          onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
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
