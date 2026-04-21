import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/servicio-tecnico", label: "Servicio técnico" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/#faq", label: "Preguntas frecuentes" },
];

const serviceLinks = [
  { href: "/servicio-tecnico", label: "Venta y asesoramiento" },
  { href: "/servicio-tecnico", label: "Servicio post venta" },
  { href: "/servicio-tecnico", label: "Reparación y mantenimiento" },
];

export function Footer() {
  return (
    <footer className="bg-bg-secondary text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Logo + contact info */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="relative h-10 w-40">
              <Image
                src="/LOGO.svg"
                alt="The Coral Garden"
                fill
                className="object-contain brightness-0 invert"
              />
            </Link>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
                <span>Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-text-secondary" />
                <Link href="mailto:Thecoral_purificadores@outlook.es" className="hover:text-white transition-colors">Thecoral_purificadores@outlook.es</Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>(+54 9 11 3953-6736)</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
              Links rápidos
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
              Nuestros servicios
            </h3>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <p className="text-center text-sm text-white/40">
            &copy; 2026 The Coral Garden Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
