import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TheCoralGarden | Soluciones en Purificación de Agua",
    template: "%s | TheCoralGarden",
  },
  description:
    "Equipos de purificación y tratamiento de agua para acuarismo, cultivo indoor, uso doméstico, comercial e industrial. Servicio técnico 24/7 especializado en ósmosis inversa.",
  keywords: [
    "purificación de agua",
    "ósmosis inversa",
    "acuarismo",
    "cultivo indoor",
    "tratamiento de agua",
    "Argentina",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
