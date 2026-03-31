import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";

// Body: Montserrat Medium (500) y Bold (700)
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// Headings: Le Havre Black (900) y Bold (700)
// Colocar los archivos en: src/app/fonts/LeHavre-Black.woff2
//                           src/app/fonts/LeHavre-Bold.woff2
const leHavre = localFont({
  variable: "--font-le-havre",
  display: "swap",
  src: [
    {
      path: "./fonts/LeHavre-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/LeHavre-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "TheCoralGarden | Soluciones en Purificación de Agua",
    template: "%s | TheCoralGarden",
  },
  icons: {
    icon: [{ url: "/LOGO.svg", type: "image/svg+xml" }],
    shortcut: ["/LOGO.svg"],
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
      <body className={`${montserrat.variable} ${leHavre.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
