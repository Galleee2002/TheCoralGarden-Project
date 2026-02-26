import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago pendiente" };

export default function CheckoutPendingPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Clock className="h-20 w-20 text-amber-500" />
      <h1 className="text-3xl font-bold">Pago pendiente</h1>
      <p className="max-w-md text-muted-foreground">
        Tu pago está siendo procesado. Te notificaremos por email cuando sea
        confirmado. El pedido quedará en espera hasta la confirmación.
      </p>
      <Button asChild size="lg">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
