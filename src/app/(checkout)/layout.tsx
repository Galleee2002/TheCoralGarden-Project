import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <WhatsAppButton />
    </>
  );
}
