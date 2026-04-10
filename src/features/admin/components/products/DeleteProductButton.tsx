"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  deleteProduct,
  forceDeleteProduct,
} from "@/features/admin/actions/productActions";
import { Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  hasOrders: boolean;
  isArchived?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function DeleteProductButton({
  productId,
  productName,
  hasOrders,
  isArchived = false,
  showLabel = false,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  const isArchivalAction = hasOrders;
  const isAlreadyArchived = hasOrders && isArchived;
  const canForceDelete = hasOrders;

  const dialogTitle = !isArchivalAction
    ? "Eliminar producto"
    : isAlreadyArchived
      ? "Producto archivado"
      : "Archivar producto";
  const dialogDescription = !isArchivalAction
    ? `¿Estás seguro de que querés eliminar "${productName}"? Esta acción no se puede deshacer.`
    : isAlreadyArchived
      ? `“${productName}” ya está archivado. Si querés eliminarlo por completo, también se borrarán las ventas asociadas.`
      : `“${productName}” dejará de mostrarse en la tienda, pero conservará el historial de compras asociado.`;
  const impactTitle = !isArchivalAction
    ? "Impacto de esta acción"
    : isAlreadyArchived
      ? "Estado actual"
      : "Qué va a pasar";
  const impactItems = !isArchivalAction
    ? [
        "El producto se eliminará definitivamente.",
        "No se podrá recuperar desde el admin.",
      ]
    : isAlreadyArchived
      ? [
          "El producto ya no aparece en el catálogo público.",
          "El historial comercial sigue vinculado a este producto.",
          "La eliminación forzada borrará también las ventas relacionadas.",
        ]
      : [
          "El producto se marcará como archivado en el admin.",
          "Ya no aparecerá en el catálogo público.",
          "El historial de compras se conserva intacto.",
        ];

  const forceImpactItems = [
    "Se eliminará el producto de forma permanente.",
    "También se eliminarán las órdenes que incluyan este producto.",
    "Esta acción borra historial comercial y no se puede deshacer.",
  ];

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProduct({ id: productId });
    setLoading(false);
    if (result?.data?.success) {
      if (result.data.result === "archived") {
        toast.success(result.data.message ?? "Producto archivado");
      } else {
        toast.success(result.data.message ?? "Producto eliminado");
      }
      setOpen(false);
      router.refresh();
    } else {
      toast.error(
        result?.data?.message ?? result?.serverError ?? "Error al eliminar el producto",
      );
    }
  }

  async function handleForceDelete() {
    setForceLoading(true);
    const result = await forceDeleteProduct({ id: productId });
    setForceLoading(false);
    if (result?.data?.success) {
      toast.success(
        result.data.message ?? "Producto eliminado de forma permanente.",
      );
      setForceOpen(false);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(
        result?.data?.message ??
          result?.serverError ??
          "No se pudo completar la eliminación forzada.",
      );
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size={showLabel ? "default" : "sm"}
        className={cn(
          isArchivalAction
            ? "text-bg-secondary hover:text-bg-secondary hover:bg-card-light"
            : "text-destructive hover:text-destructive hover:bg-destructive/10",
          showLabel && "min-h-11 min-w-[44px] px-4",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label={`${isArchivalAction ? (isAlreadyArchived ? "Revisar" : "Archivar") : "Eliminar"} ${productName}`}
        disabled={loading || forceLoading}
      >
        {isArchivalAction ? <Archive className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        {showLabel && (
          <span>
            {isAlreadyArchived
              ? "Revisar"
              : isArchivalAction
                ? "Archivar"
                : "Eliminar"}
          </span>
        )}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={dialogTitle}
        description={dialogDescription}
        impactTitle={impactTitle}
        impactItems={impactItems}
        confirmLabel={isArchivalAction ? "Archivar producto" : "Eliminar"}
        confirmVariant={isArchivalAction ? "default" : "destructive"}
        tone={isArchivalAction ? "archival" : "destructive"}
        onConfirm={isAlreadyArchived ? undefined : handleDelete}
        loading={loading}
        hideConfirm={isAlreadyArchived}
        secondaryLabel={canForceDelete ? "Eliminar forzado" : undefined}
        secondaryVariant={canForceDelete ? "destructive" : undefined}
        onSecondaryAction={
          canForceDelete
            ? () => {
                setOpen(false);
                setForceOpen(true);
              }
            : undefined
        }
      />

      <ConfirmDialog
        open={forceOpen}
        onOpenChange={setForceOpen}
        title="Eliminar producto y ventas asociadas"
        description={`Vas a borrar "${productName}" junto con las órdenes vinculadas a este producto. Usá esta opción sólo para datos de prueba o limpieza excepcional.`}
        impactTitle="Impacto irreversible"
        impactItems={forceImpactItems}
        confirmLabel="Eliminar forzado"
        confirmVariant="destructive"
        tone="destructive"
        onConfirm={handleForceDelete}
        loading={forceLoading}
      />
    </>
  );
}
