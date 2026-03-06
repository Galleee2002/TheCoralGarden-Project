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
          <div className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image
              src="/DUEÑOS.png"
              alt="Fundadores de The Coral Garden"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="mb-4 font-heading text-3xl font-black uppercase text-text-primary md:text-[64px]">
              The Coral Garden
            </h2>
            <p className="mb-4 text-base font-bold text-text-primary">
              Especialistas en purificacion y tratamiento de agua.
            </p>
            <p className="mb-6 text-base leading-relaxed text-text-primary/70">
              Somos un equipo pequeño con una gran misión: concientizar sobre la importancia del agua pura. Desde hace más de 10 años impulsamos el uso de ósmosis inversa en cultivo, acuarismo, detailing, cosmética y muchos ámbitos más.

Creemos en informar, educar y acompañar — sin tabúes, con transparencia y pasión.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link href="/sobre-nosotros">Conoce mas</Link>
            </Button>
          </div>
        </div>

        {/* Bottom: 3 image cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-muted">
            {gallery1 && (
              <Image src={gallery1} alt="Galería 1" fill className="object-cover" />
            )}
          </div>

          {/* Card 2 — with overlay text */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-muted">
            {gallery2 && (
              <Image src={gallery2} alt="Galería 2" fill className="object-cover" />
            )}
            <div className="absolute inset-0 flex flex-col items-start justify-start bg-gradient-to-t from-black/60 to-transparent p-6 mt-13 ">
              <p className="mb-3 text-lg font-medium text-white">
Desarrollamos soluciones de filtración y ósmosis inversa para sistemas que requieren máxima estabilidad y calidad.              </p>
              <Button variant="default" size="lg" asChild>
                <Link href="/productos">Ver mas</Link>
              </Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-muted">
            {gallery3 && (
              <Image src={gallery3} alt="Galería 3" fill className="object-cover" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
