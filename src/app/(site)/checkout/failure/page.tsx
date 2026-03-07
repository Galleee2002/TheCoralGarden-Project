import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Error en el pago" };

export default function CheckoutFailurePage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <XCircle className="h-20 w-20 text-destructive" />
      <h1 className="text-3xl font-bold">Hubo un problema con el pago</h1>
      <p className="max-w-md text-muted-foreground">
        No se procesó el pago. Podés intentarlo nuevamente o contactarnos por
        WhatsApp para asistencia.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/checkout">Intentar de nuevo</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
