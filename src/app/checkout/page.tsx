import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completá tu compra de manera segura con MercadoPago.",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  );
}
