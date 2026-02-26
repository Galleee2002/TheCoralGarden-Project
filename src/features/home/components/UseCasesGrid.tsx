import Link from "next/link";
import { SectionHeader } from "@/components/shared/SectionHeader";

const useCases = [
  {
    label: "Acuarismo",
    slug: "acuarismo",
    emoji: "🐠",
    description: "Agua perfecta para tus acuarios",
    gradient: "from-blue-500/20 to-cyan-400/20",
  },
  {
    label: "Cultivo Indoor",
    slug: "cultivo-indoor",
    emoji: "🌿",
    description: "Optimización para tus cultivos",
    gradient: "from-green-500/20 to-emerald-400/20",
  },
  {
    label: "Uso Doméstico",
    slug: "domestico",
    emoji: "🏠",
    description: "Agua pura para toda la familia",
    gradient: "from-primary/20 to-sky-400/20",
  },
  {
    label: "Comercial",
    slug: "comercial",
    emoji: "🏢",
    description: "Soluciones para negocios y locales",
    gradient: "from-orange-500/20 to-amber-400/20",
  },
  {
    label: "Industrial",
    slug: "industrial",
    emoji: "🏭",
    description: "Equipos de alta capacidad",
    gradient: "from-slate-500/20 to-zinc-400/20",
  },
];

export function UseCasesGrid() {
  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Soluciones para cada uso"
          subtitle="Encontrá el equipo ideal según tu aplicación."
          centered
          className="mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              href={`/productos?categoria=${uc.slug}`}
              className={`group flex flex-col items-center rounded-xl bg-gradient-to-br ${uc.gradient} border border-white/50 p-6 text-center transition-all hover:scale-105 hover:shadow-md`}
            >
              <span className="mb-3 text-4xl">{uc.emoji}</span>
              <h3 className="font-semibold text-foreground">{uc.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {uc.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
