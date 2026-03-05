import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        {/* Top: photo + text */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image
              src="/DUEÑOS.png"
              alt="Fundadores de The Coral Garden"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="mb-4 font-heading text-3xl font-black uppercase text-text-primary sm:text-6xl">
              The Coral Garden
            </h2>
            <p className="mb-4 text-lg font-bold text-text-primary">
              Somos especialistas en purificacion y tratamiento de agua.
            </p>
            <p className="mb-6 leading-relaxed text-text-primary/70">
              Con años de experiencia en el mercado, nos dedicamos a brindar
              soluciones integrales en purificacion de agua para hogares,
              comercios e industrias. Nuestro equipo de profesionales garantiza
              la mejor calidad en cada producto y servicio que ofrecemos.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link href="/sobre-nosotros">Conoce mas</Link>
            </Button>
          </div>
        </div>

        {/* Bottom: 3 image cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {/* Card 1 — placeholder */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-muted" />

          {/* Card 2 — with overlay text */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-muted">
            <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 to-transparent p-6 text-center">
              <p className="mb-3 text-lg font-bold text-white">
                Descubri nuestros productos
              </p>
              <Link
                href="/productos"
                className="rounded-button border border-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-text-primary"
              >
                Ver mas
              </Link>
            </div>
          </div>

          {/* Card 3 — placeholder */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-muted" />
        </div>
      </div>
    </section>
  );
}
