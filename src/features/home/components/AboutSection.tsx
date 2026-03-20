import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/features/admin/actions/settingActions";

export async function AboutSection() {
  const [gallery1, gallery2, gallery3] = await Promise.all([
    getSetting("about_gallery_1"),
    getSetting("about_gallery_2"),
    getSetting("about_gallery_3"),
  ]);
  return (
    <section className="py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        {/* Top: photo + text */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <div className="rounded-card relative aspect-[4/3] overflow-hidden">
            <Image
              src="/DUEÑOS.png"
              alt="Fundadores de The Coral Garden"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="font-heading text-text-primary mb-4 text-3xl font-black uppercase md:text-[64px]">
              The Coral Garden
            </h2>
            <p className="text-text-primary mb-4 text-base font-bold">
              Especialistas en purificación y tratamiento de agua.
            </p>
            <p className="text-text-primary/70 mb-6 text-base leading-relaxed">
              Somos un equipo pequeño con una gran misión: concientizar sobre la
              importancia del agua pura. Desde hace más de 10 años impulsamos el
              uso de ósmosis inversa en cultivo, acuarismo, detailing, cosmética
              y muchos ámbitos más. Creemos en informar, educar y acompañar —
              sin tabúes, con transparencia y pasión.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link href="/sobre-nosotros">Conocé más</Link>
            </Button>
          </div>
        </div>

        {/* Bottom: 3 image cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-card bg-muted relative aspect-[16/9] overflow-hidden">
            {gallery1 && (
              <Image
                src={gallery1}
                alt="Galería 1"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Card 2 — with overlay text */}
          <div className="rounded-card bg-muted relative aspect-[16/9] overflow-hidden">
            {gallery2 && (
              <Image
                src={gallery2}
                alt="Galería 2"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="mb-3 text-sm font-medium text-white md:text-base lg:text-lg">
                Desarrollamos soluciones de filtración y ósmosis inversa para
                sistemas que requieren máxima estabilidad y calidad.{" "}
              </p>
              <Button variant="default" size="lg" asChild>
                <Link href="/productos">Ver más</Link>
              </Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-card bg-muted relative aspect-[16/9] overflow-hidden">
            {gallery3 && (
              <Image
                src={gallery3}
                alt="Galería 3"
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
