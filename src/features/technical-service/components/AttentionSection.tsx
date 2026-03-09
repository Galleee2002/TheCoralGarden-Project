import { CheckCircle2 } from "lucide-react";

const cards = [
  "Reparación, mantenimiento y optimización.",
  "Garantía de eficiencia y durabilidad.",
  "Acuarismo, cultivo, uso doméstico, comercial e industrial.",
];

export function AttentionSection() {
  return (
    <section className="py-section-mobile md:py-section bg-bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading mb-6 text-4xl font-black uppercase text-center md:text-[64px] text-text-primary">
          Atención los{" "}
          <span className="bg-gradient-to-r from-[#042F34] to-[#74E4BB] bg-clip-text text-transparent">
            365 días del año
          </span>
        </h2>

        <p className="mb-10 text-center text-base text-text-primary/80 max-w-2xl mx-auto md:text-lg">
          Estamos disponibles todos los días del año para atender tus
          consultas y resolver cualquier problema con tu equipo.
        </p>

        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {cards.map((text) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-card border-2 border-border/60 bg-card-light px-6 py-4"
            >
              <CheckCircle2 className="h-6 w-6 shrink-0 text-text-primary" />
              <span className="text-base font-medium text-text-primary">
                {text}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm font-bold uppercase tracking-wide text-text-primary md:text-base">
          ¡Si necesitas reparar tu equipo no dudes en consultarnos!
        </p>
      </div>
    </section>
  );
}
