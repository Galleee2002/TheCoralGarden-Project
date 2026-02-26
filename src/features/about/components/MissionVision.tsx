import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";

export function MissionVision() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proveer equipos de purificación y tratamiento de agua de
                excelente calidad, acompañados de un servicio técnico de primer
                nivel, para que cada cliente tenga acceso a agua pura en
                cualquier aplicación y escala.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser la referencia en Argentina en soluciones integrales de
                tratamiento de agua, reconocidos por la calidad de nuestros
                productos y la confiabilidad de nuestro soporte técnico
                disponible las 24 horas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
