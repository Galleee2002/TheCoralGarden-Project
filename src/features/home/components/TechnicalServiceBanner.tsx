import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Wrench } from "lucide-react";

export function TechnicalServiceBanner() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
                <Wrench className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Servicio Técnico 24/7
              </h2>
            </div>
            <p className="max-w-lg text-primary-foreground/80">
              Reparación, mantenimiento y optimización de equipos de ósmosis
              inversa y purificación de agua. Cobertura para todos los usos:
              acuarismo, cultivo, doméstico, comercial e industrial.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" />
                <span>Disponible 365 días</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-accent" />
                <span>Respuesta inmediata</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="px-8"
            >
              <Link href="/servicio-tecnico">Solicitar servicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
