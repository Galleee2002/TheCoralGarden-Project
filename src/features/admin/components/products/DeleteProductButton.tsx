"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { deleteProduct } from "@/features/admin/actions/productActions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
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
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
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
