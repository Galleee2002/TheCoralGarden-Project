import { getFerias } from "@/features/ferias/actions/feriaActions";
import { FeriaCard } from "@/features/ferias/components/FeriaCard";
import { MiniBanner } from "@/features/home/components/MiniBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferias — The Coral Garden",
  description: "Conocé las ferias y eventos donde nos podés encontrar.",
};

export const revalidate = 3600;

export default async function FeriasPage() {
  const ferias = await getFerias();

  return (
    <>
      <main>
        {/* Page header */}
        <section className="bg-bg-primary py-section-mobile md:py-section">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl font-black text-text-primary md:text-[64px]">
              FERIAS
            </h1>
            <p className="mt-3 font-sans text-base text-muted-foreground md:text-lg">
              Las ferias y eventos donde nos encontrás
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-bg-primary pb-section-mobile md:pb-section">
          <div className="container mx-auto px-4">
            {ferias.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-sans text-base text-muted-foreground">
                  Próximamente compartiremos nuestras ferias.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {ferias.map((feria) => (
                  <FeriaCard
                    key={feria.id}
                    title={feria.title}
                    description={feria.description}
                    imageUrl={feria.imageUrl}
                    date={feria.date}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <MiniBanner />
    </>
  );
}
