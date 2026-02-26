import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/SectionHeader";

const useCases = [
  { label: "Acuarismo", emoji: "🐠" },
  { label: "Cultivo Indoor", emoji: "🌿" },
  { label: "Uso Doméstico", emoji: "🏠" },
  { label: "Comercial", emoji: "🏢" },
  { label: "Industrial", emoji: "🏭" },
];

export function CoverageSection() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Cobertura de servicios"
          subtitle="Atendemos equipos para todos los usos. También trabajamos con marcas externas."
          centered
          className="mb-10"
        />

        <div className="flex flex-wrap justify-center gap-3">
          {useCases.map((uc) => (
            <Badge
              key={uc.label}
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              {uc.emoji} {uc.label}
            </Badge>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Trabajamos con nuestra marca y otras del mercado.
        </p>
      </div>
    </section>
  );
}
