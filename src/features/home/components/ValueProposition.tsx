import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, ShieldCheck, Zap } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Calidad garantizada",
    description:
      "Equipos de alta performance con garantía. Solo trabajamos con las mejores marcas del mercado.",
  },
  {
    icon: Clock,
    title: "Soporte 24/7",
    description:
      "Servicio técnico disponible las 24 horas, los 365 días del año. Tu equipo nunca se detiene.",
  },
  {
    icon: Zap,
    title: "Soluciones rápidas",
    description:
      "Diagnóstico y reparación eficiente. Minimizamos el tiempo de inactividad de tu sistema.",
  },
  {
    icon: Award,
    title: "Experiencia comprobada",
    description:
      "Años de experiencia en purificación de agua para todos los usos y escalas.",
  },
];

export function ValueProposition() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="¿Por qué elegir TheCoralGarden?"
          subtitle="Soluciones integrales de tratamiento de agua con respaldo técnico de primer nivel."
          centered
          className="mb-10"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card
              key={value.title}
              className="border-primary/10 transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
