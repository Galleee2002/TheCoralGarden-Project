"use client";

import { Button } from "@/components/ui/button";
import {
  refreshShippingTracking,
  retryShippingImport,
} from "@/features/admin/actions/shippingActions";
import { RefreshCcw, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ShippingActionsProps {
  orderId: string;
  canRetryImport: boolean;
  canRefreshTracking: boolean;
}

export function ShippingActions({
  orderId,
  canRetryImport,
  canRefreshTracking,
}: ShippingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"retry" | "tracking" | null>(null);

  const handleRetry = async () => {
    setLoading("retry");
    const result = await retryShippingImport({ orderId });
    setLoading(null);

    if (result?.data?.success) {
      toast.success("Importacion reintentada");
      router.refresh();
    } else {
      toast.error(result?.serverError ?? "No se pudo reintentar la importacion");
    }
  };

  const handleRefresh = async () => {
    setLoading("tracking");
    const result = await refreshShippingTracking({ orderId });
    setLoading(null);

    if (result?.data?.success) {
      toast.success("Tracking actualizado");
      router.refresh();
    } else {
      toast.error(result?.serverError ?? "No se pudo actualizar el tracking");
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {canRetryImport && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={loading !== null}
        >
          <RotateCcw className="h-4 w-4" />
          Reimportar
        </Button>
      )}
      {canRefreshTracking && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading !== null}
        >
          <RefreshCcw className="h-4 w-4" />
          Tracking
        </Button>
      )}
    </div>
  );
}
