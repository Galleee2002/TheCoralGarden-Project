import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago exitoso" };

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <CheckCircle className="h-20 w-20 text-green-500" />
      <h1 className="text-3xl font-bold">¡Pago exitoso!</h1>
      <p className="max-w-md text-muted-foreground">
        Tu pedido fue confirmado. Recibirás un email con los detalles de tu
        compra. Nos pondremos en contacto para coordinar el envío.
      </p>
      <Button asChild size="lg">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
