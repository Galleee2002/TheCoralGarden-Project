import { SectionHeader } from "@/components/shared/SectionHeader";
import { Award, Clock, HandshakeIcon, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Productos de calidad garantizada",
    description:
      "Solo comercializamos equipos que cumplen con nuestros estándares de calidad y durabilidad.",
  },
  {
    icon: Clock,
    title: "Soporte sin horarios",
    description:
      "Nuestro equipo técnico está disponible 24/7. Porque los problemas con el agua no esperan.",
  },
  {
    icon: Award,
    title: "Especialistas en ósmosis inversa",
    description:
      "Años de experiencia trabajando con sistemas de purificación de agua para todos los usos.",
  },
  {
    icon: HandshakeIcon,
    title: "Compromiso post-venta",
    description:
      "No desaparecemos después de la venta. Estamos para acompañarte en todo el ciclo de vida del equipo.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="¿Por qué elegirnos?"
          subtitle="Nuestros diferenciales que nos hacen únicos."
          centered
          className="mb-10"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <reason.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
