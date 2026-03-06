import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { getSetting } from "@/features/admin/actions/settingActions";

const features = [
  "Agua pura para tu hogar, comercio o industria",
  "Servicio tecnico especializado 24/7",
  "Envios a todo el pais",
];

export async function HeroSection() {
  const heroBannerUrl = await getSetting("hero_banner_url");

  return (
    <section className="relative -mt-16 flex min-h-screen items-center overflow-hidden">
      {/* Background */}
      {heroBannerUrl ? (
        <Image
          src={heroBannerUrl}
          alt="Hero banner"
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#042F34] via-[#063B41] to-[#111C24]" />
      )}
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="container relative z-10 mx-auto px-4 py-32">
        <div className="max-w-5xl">
          <h1 className="mb-8 font-heading text-5xl font-black uppercase leading-[1.1] text-white md:text-[96px]">
            Purificadores de agua
          </h1>

          <ul className="mb-10 flex flex-col gap-4">
            {features.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-text-secondary" />
                <span className="text-base font-medium text-white/90 md:text-2xl">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/productos"
            className="inline-flex items-center rounded-button border-2 border-text-secondary px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-text-secondary hover:text-bg-secondary"
          >
            Conoce mas
          </Link>
        </div>
      </div>
    </section>
  );
}
