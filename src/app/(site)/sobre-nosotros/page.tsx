import { AboutHero } from "@/features/about/components/AboutHero";
import { SpecialtiesSection } from "@/features/about/components/SpecialtiesSection";
import { BrandsCarousel } from "@/features/home/components/BrandsCarousel";
import { MiniBanner } from "@/features/home/components/MiniBanner";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Conocé la historia y misión de TheCoralGarden, especialistas en soluciones de purificación de agua.",
  alternates: {
    canonical: "/sobre-nosotros",
  },
};

export default function AboutPage() {
  return (
    <>
      <RevealOnScroll>
        <AboutHero />
      </RevealOnScroll>
      <SpecialtiesSection />
      {/* Trust section: heading + carrusel */}
      <RevealOnScroll direction="up" delay={0.05}>
        <div className="pt-section-mobile md:pt-section bg-bg-primary mb-10">
          <div className="mx-auto w-full max-w-screen-2xl px-4 text-center">
            <h2 className="font-heading text-4xl text-black uppercase sm:text-5xl md:text-[64px]">
              CONFÍAN EN NOSOTROS
            </h2>
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll direction="fade" delay={0.1}>
        <BrandsCarousel />
      </RevealOnScroll>
      <RevealOnScroll direction="up" delay={0.1}>
        <MiniBanner />
      </RevealOnScroll>
    </>
  );
}
