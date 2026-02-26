import { AboutHero } from "@/features/about/components/AboutHero";
import { MissionVision } from "@/features/about/components/MissionVision";
import { WhyChooseUs } from "@/features/about/components/WhyChooseUs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Conocé la historia y misión de TheCoralGarden, especialistas en soluciones de purificación de agua.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <WhyChooseUs />

      {/* CTA final */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            ¿Listo para empezar?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Explorá nuestros productos o consultá por nuestro servicio técnico.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/servicio-tecnico">Servicio Técnico</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
