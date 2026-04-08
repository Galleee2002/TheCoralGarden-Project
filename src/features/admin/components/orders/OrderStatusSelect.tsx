"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/features/admin/actions/updateOrderStatus";
import type { OrderStatus } from "@/types/enums";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING",    label: "Pendiente" },
  { value: "PAID",       label: "Pagado" },
  { value: "PROCESSING", label: "En proceso" },
  { value: "SHIPPED",    label: "Enviado" },
  { value: "DELIVERED",  label: "Entregado" },
  { value: "CANCELLED",  label: "Cancelado" },
];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
  className?: string;
  triggerClassName?: string;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
  className,
  triggerClassName,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setLoading(true);
    const result = await updateOrderStatus({ orderId, status: value as OrderStatus });
    setLoading(false);
    if (result?.data) {
      toast.success("Estado actualizado");
      router.refresh();
    } else {
      toast.error("Error al actualizar el estado");
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={loading}
    >
      <SelectTrigger
        className={cn("min-h-11 w-full text-sm", triggerClassName)}
        aria-label="Cambiar estado de la orden"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={cn("w-(--radix-select-trigger-width)", className)}>
        {orderStatusOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-sm">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
