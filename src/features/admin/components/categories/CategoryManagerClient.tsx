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
import {
  deleteCategory,
  forceDeleteCategory,
} from "@/features/admin/actions/categoryActions";
import { Plus, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
  productsWithOrdersCount: number;
  affectedProductNames: string[];
}

interface CategoryManagerClientProps {
  categories: Category[];
}

type DialogState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; category: Category };

type DeleteState = Category | null;

export function CategoryManagerClient({ categories: initial }: CategoryManagerClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [dialog, setDialog] = useState<DialogState>({ type: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<DeleteState>(null);
  const [isDeleting, startDelete] = useTransition();
  const [forceDeleteTarget, setForceDeleteTarget] = useState<DeleteState>(null);
  const [isForceDeleting, startForceDelete] = useTransition();

  const handleCreated = (cat: { id: string; name: string; slug: string }) => {
    setCategories((prev) => [
      ...prev,
      {
        ...cat,
        description: null,
        _count: { products: 0 },
        productsWithOrdersCount: 0,
        affectedProductNames: [],
      },
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
        toast.success(result.data.message ?? "Categoría eliminada");
        router.refresh();
      } else if (result?.data?.result === "blocked") {
        toast.error(result.data.message);
      } else {
        toast.error(
          result?.data?.message ??
            result?.serverError ??
            "No se pudo eliminar la categoría",
        );
      }
      setDeleteTarget(null);
    });
  };

  const handleForceDelete = () => {
    if (!forceDeleteTarget) return;

    startForceDelete(async () => {
      const result = await forceDeleteCategory({ id: forceDeleteTarget.id });
      if (result?.data?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== forceDeleteTarget.id));
        toast.success(
          result.data.message ?? "Categoría eliminada de forma permanente.",
        );
        router.refresh();
      } else {
        toast.error(
          result?.data?.message ??
            result?.serverError ??
            "No se pudo completar la eliminación forzada.",
        );
      }
      setForceDeleteTarget(null);
    });
  };

  const getCategoryState = (category: Category) => {
    if (category.productsWithOrdersCount > 0) {
      return {
        result: "blocked" as const,
        title: "No se puede eliminar esta categoría",
        description:
          "Tiene productos con compras asociadas. Antes de eliminarla, primero debes mover esos productos a otra categoría.",
        impactTitle: "Productos que mantienen historial comercial",
        impactItems: [
          ...category.affectedProductNames.map((name) => `Producto con historial: ${name}`),
          category.productsWithOrdersCount > category.affectedProductNames.length
            ? `${category.productsWithOrdersCount - category.affectedProductNames.length} producto(s) adicional(es) con historial.`
            : null,
        ].filter(Boolean) as string[],
        secondaryLabel: "Ver productos de esta categoría",
        actionLabel: "Revisar",
      };
    }

    if (category._count.products > 0) {
      return {
        result: "delete-with-products" as const,
        title: "Eliminar categoría y productos",
        description:
          "Esta categoría se eliminará junto con todos los productos que contiene. Sólo se permitirá porque ninguno tiene compras asociadas.",
        impactTitle: "Impacto de esta acción",
        impactItems: [
          `${category._count.products} producto(s) se eliminarán junto con la categoría.`,
          "Esta acción no se puede deshacer.",
        ],
        actionLabel: "Eliminar",
      };
    }

    return {
      result: "delete-empty" as const,
      title: "Eliminar categoría",
      description: `¿Estás seguro de que querés eliminar "${category.name}"? Esta acción no se puede deshacer.`,
      impactTitle: "Impacto de esta acción",
      impactItems: ["La categoría se eliminará definitivamente."],
      actionLabel: "Eliminar",
    };
  };

  const deleteState = deleteTarget ? getCategoryState(deleteTarget) : null;

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
            categories.map((cat) => {
              const state = getCategoryState(cat);
              const isBlocked = state.result === "blocked";

              return (
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

                  <div className="mt-3 flex flex-wrap gap-2">
                    {isBlocked ? (
                      <>
                        <StatusBadge variant="blocked" label="No eliminable" />
                        <StatusBadge
                          variant="history"
                          label={`${cat.productsWithOrdersCount} con historial`}
                        />
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-dropdown bg-card-light p-3 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">Descripción</p>
                    <p className="mt-1 text-text-primary break-words">
                      {cat.description ?? "Sin descripción"}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {isBlocked
                        ? "Antes de eliminar esta categoría, mové los productos con historial a otra categoría."
                        : cat._count.products > 0
                          ? "Eliminar esta categoría también eliminará los productos que contiene."
                          : "La categoría está lista para eliminarse."}
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
                      className={
                        isBlocked
                          ? "min-h-11 flex-1 justify-center border-amber-300 text-amber-800 hover:bg-amber-50"
                          : "min-h-11 flex-1 justify-center border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive hover:text-white [&>svg]:hover:text-white"
                      }
                      onClick={() => setDeleteTarget(cat)}
                    >
                      {isBlocked ? (
                        <TriangleAlert className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {state.actionLabel}
                    </Button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto rounded-card border border-border/50 shadow-sm">
          <Table className="min-w-[1080px]">
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[18%]" noWrap={false}>Nombre</TableHead>
                <TableHead className="w-[18%]" noWrap={false}>Slug</TableHead>
                <TableHead className="w-[34%]" noWrap={false}>Descripción</TableHead>
                <TableHead className="w-[10%]">Productos</TableHead>
                <TableHead className="w-[18%]" noWrap={false}>Estado</TableHead>
                <TableHead className="w-[20%] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <EmptyState colSpan={6} message="No hay categorías cargadas" />
              ) : (
                categories.map((cat) => {
                  const state = getCategoryState(cat);
                  const isBlocked = state.result === "blocked";

                  return (
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
                      <TableCell noWrap={false}>
                        <div className="flex min-w-[220px] flex-wrap gap-2">
                          {isBlocked ? (
                            <>
                              <StatusBadge variant="blocked" label="No eliminable" />
                              <StatusBadge
                                variant="history"
                                label={`${cat.productsWithOrdersCount} con historial`}
                              />
                            </>
                          ) : (
                            <StatusBadge
                              variant="active"
                              label={cat._count.products > 0 ? "Eliminable con impacto" : "Eliminable"}
                            />
                          )}
                        </div>
                      </TableCell>
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
                            className={
                              isBlocked
                                ? "min-h-9 border-amber-300 text-amber-800 hover:bg-amber-50"
                                : "min-h-9 text-destructive hover:bg-destructive hover:text-white hover:border-destructive [&>svg]:hover:text-white"
                            }
                            onClick={() => setDeleteTarget(cat)}
                          >
                            {isBlocked ? (
                              <TriangleAlert className="mr-1.5 h-3.5 w-3.5" />
                            ) : (
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {state.actionLabel}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
        title={deleteState ? deleteState.title : "Eliminar categoría"}
        description={
          deleteState
            ? deleteState.description
            : "¿Estás seguro de que querés eliminar esta categoría?"
        }
        impactTitle={deleteState?.impactTitle}
        impactItems={deleteState?.impactItems}
        confirmVariant="destructive"
        tone={deleteState?.result === "blocked" ? "blocked" : "destructive"}
        onConfirm={
          deleteTarget && deleteState?.result === "blocked"
            ? () => {
                setDeleteTarget(null);
                setForceDeleteTarget(deleteTarget);
              }
            : handleDelete
        }
        loading={isDeleting}
        cancelLabel={
          deleteState?.result === "blocked" ? "Cerrar" : "Cancelar"
        }
        confirmLabel={
          deleteState?.result === "blocked"
            ? "Continuar con eliminación forzada"
            : "Eliminar"
        }
        secondaryLabel={
          deleteState?.result === "blocked"
            ? "Ver productos de esta categoría"
            : undefined
        }
        secondaryVariant="outline"
        onSecondaryAction={
          deleteTarget && deleteState?.result === "blocked"
            ? () => {
                router.push(`/admin/productos?category=${deleteTarget.slug}`);
                setDeleteTarget(null);
              }
            : undefined
        }
      />

      <ConfirmDialog
        open={!!forceDeleteTarget}
        onOpenChange={(open) => !open && setForceDeleteTarget(null)}
        title="Eliminar categoría, productos y ventas asociadas"
        description={
          forceDeleteTarget
            ? `Vas a borrar la categoría “${forceDeleteTarget.name}”, sus productos y todas las órdenes relacionadas con esos productos.`
            : "Vas a borrar una categoría con ventas asociadas."
        }
        impactTitle="Impacto irreversible"
        impactItems={[
          "La categoría se eliminará definitivamente.",
          "Los productos dentro de esta categoría se eliminarán.",
          "También se eliminarán las órdenes vinculadas a esos productos.",
          "Esta acción está pensada sólo para limpieza excepcional o datos de prueba.",
        ]}
        confirmLabel="Eliminar forzado"
        confirmVariant="destructive"
        tone="destructive"
        onConfirm={handleForceDelete}
        loading={isForceDeleting}
      />
    </>
  );
}
