"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { deleteProduct } from "@/features/admin/actions/productActions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  showLabel?: boolean;
  className?: string;
}

export function DeleteProductButton({
  productId,
  productName,
  showLabel = false,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProduct({ id: productId });
    setLoading(false);
    if (result?.data?.success) {
      toast.success("Producto eliminado");
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Error al eliminar el producto");
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size={showLabel ? "default" : "sm"}
        className={cn(
          "text-destructive hover:text-destructive hover:bg-destructive/10",
          showLabel && "min-h-11 min-w-[44px] px-4",
          className
        )}
        onClick={() => setOpen(true)}
        aria-label={`Eliminar ${productName}`}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
        {showLabel && <span>Eliminar</span>}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Eliminar producto"
        description={`¿Estás seguro de que querés eliminar "${productName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
