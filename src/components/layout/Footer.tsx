import Link from "next/link";
import { Droplets, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-accent" />
              <span className="font-bold text-background">TheCoralGarden</span>
            </Link>
            <p className="text-sm text-background/70">
              Soluciones profesionales en purificación y tratamiento de agua
              para todos los usos.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Navegación
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/productos", label: "Productos" },
                { href: "/servicio-tecnico", label: "Servicio Técnico" },
                { href: "/sobre-nosotros", label: "Sobre Nosotros" },
                { href: "/carrito", label: "Carrito" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluciones */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Soluciones
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-background/70">
              <li>Acuarismo</li>
              <li>Cultivo Indoor</li>
              <li>Uso Doméstico</li>
              <li>Comercial e Industrial</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 text-accent" />
                <span>Servicio Técnico 24/7</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@thecoralgarden.com.ar</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-background/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} TheCoralGarden. Todos los derechos
            reservados.
          </p>
          <p>Hecho con amor para el agua limpia 💧</p>
        </div>
      </div>
    </footer>
  );
}
