"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/features/admin/actions/deleteOrder";
import { cn } from "@/lib/utils";

interface DeleteOrderButtonProps {
  orderId: string;
  customerName: string;
  showLabel?: boolean;
  className?: string;
}

export function DeleteOrderButton({
  orderId,
  customerName,
  showLabel = true,
  className,
}: DeleteOrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteOrder({ id: orderId });
    setLoading(false);

    if (result?.data?.success) {
      toast.success("Orden eliminada");
      setOpen(false);
      router.refresh();
    } else {
      toast.error("No se pudo eliminar la orden");
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={showLabel ? "default" : "sm"}
        className={cn(
          "border-destructive/50 text-destructive transition-colors hover:border-destructive hover:bg-destructive hover:text-white [&>svg]:hover:text-white",
          showLabel ? "min-h-11 min-w-[44px]" : "min-h-9",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label={`Eliminar orden de ${customerName}`}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
        {showLabel ? <span>Eliminar</span> : null}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Eliminar orden"
        description={`¿Estás seguro de que querés eliminar la orden #${orderId.slice(0, 8)} de ${customerName}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}
