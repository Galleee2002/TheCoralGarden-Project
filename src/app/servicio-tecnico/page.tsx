import { TechnicalServiceHero } from "@/features/technical-service/components/TechnicalServiceHero";
import { ServicesCards } from "@/features/technical-service/components/ServicesCards";
import { CoverageSection } from "@/features/technical-service/components/CoverageSection";
import { TechnicalServiceForm } from "@/features/technical-service/components/TechnicalServiceForm";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicio Técnico 24/7",
  description:
    "Servicio técnico especializado en equipos de ósmosis inversa y purificación de agua, disponible 24hs los 365 días del año.",
};

export default function TechnicalServicePage() {
  return (
    <>
      <TechnicalServiceHero />
      <ServicesCards />
      <CoverageSection />

      {/* Contact form */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <SectionHeader
            title="Solicitá el servicio"
            subtitle="Completá el formulario y te contactamos a la brevedad para coordinar."
            centered
            className="mb-10"
          />
          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <TechnicalServiceForm />
          </div>
        </div>
      </section>
    </>
  );
}
