import { AboutHero } from "@/features/about/components/AboutHero";
import { SpecialtiesSection } from "@/features/about/components/SpecialtiesSection";
import { BrandsCarousel } from "@/features/home/components/BrandsCarousel";
import { MiniBanner } from "@/features/home/components/MiniBanner";
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
      <AboutHero />
      <SpecialtiesSection />
      {/* Trust section: heading + carrusel */}
      <div className="pt-section-mobile md:pt-section bg-bg-primary mb-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-[48px] text-black uppercase md:text-[64px]">
            CONFÍAN EN NOSOTROS
          </h2>
        </div>
      </div>
      <BrandsCarousel />
      <MiniBanner />
    </>
  );
}
