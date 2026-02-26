import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Servicio técnico disponible 24hs / 365 días
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Agua pura para{" "}
            <span className="text-primary">cada necesidad</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Distribuidores de equipos de purificación y tratamiento de agua para
            acuarismo, cultivo indoor, uso doméstico, comercial e industrial.
            Especialistas en ósmosis inversa.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/productos">
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 px-8"
            >
              <Link href="/servicio-tecnico">
                <Wrench className="h-4 w-4" />
                Servicio Técnico
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative water waves */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 80"
          className="w-full fill-background"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
