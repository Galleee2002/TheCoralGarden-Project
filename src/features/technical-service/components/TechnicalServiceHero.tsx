import { Badge } from "@/components/ui/badge";
import { Clock, PhoneCall } from "lucide-react";

export function TechnicalServiceHero() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
          <Clock className="mr-1.5 h-3 w-3" />
          Disponible 24hs / 365 días
        </Badge>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Servicio Técnico
          <br />
          <span className="text-accent">Especializado</span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 sm:text-xl">
          Reparación, mantenimiento y optimización de equipos de ósmosis inversa
          y purificación de agua. Respondemos rápido porque el agua no espera.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
            <PhoneCall className="h-4 w-4 text-accent" />
            Respuesta inmediata
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
            <Clock className="h-4 w-4 text-accent" />
            Sin días ni horarios
          </div>
        </div>
      </div>
    </section>
  );
}
