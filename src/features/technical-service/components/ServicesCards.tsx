import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Settings, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Reparación",
    description:
      "Diagnóstico y reparación de equipos de ósmosis inversa, filtros y sistemas de purificación. Trabajamos con todas las marcas del mercado.",
  },
  {
    icon: Settings,
    title: "Mantenimiento",
    description:
      "Planes de mantenimiento preventivo para prolongar la vida útil de tus equipos y garantizar el máximo rendimiento.",
  },
  {
    icon: TrendingUp,
    title: "Optimización",
    description:
      "Ajustes y mejoras para que tu sistema de purificación funcione al máximo de su capacidad y eficiencia.",
  },
];

export function ServicesCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="border-primary/10 transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
