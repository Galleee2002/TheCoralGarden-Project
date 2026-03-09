import { TechnicalServiceHero } from "@/features/technical-service/components/TechnicalServiceHero";
import { AttentionSection } from "@/features/technical-service/components/AttentionSection";
import { ContactCards } from "@/features/technical-service/components/ContactCards";
import { MiniBanner } from "@/features/home/components/MiniBanner";
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
      <AttentionSection />
      <ContactCards />
      <MiniBanner />
    </>
  );
}
