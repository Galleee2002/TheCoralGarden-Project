import Link from "next/link";
import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
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
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-5xl">
          <h1 className="font-heading mb-8 text-5xl leading-[1.1] font-black text-white uppercase md:text-[96px]">
            Purificadores de agua
          </h1>

          <ul className="mb-10 flex flex-col gap-4">
            {features.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CircleCheckBig className="h-[28px] w-[28px] shrink-0 text-white" />
                <span className="text-base font-medium text-white/90 md:text-2xl">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/productos"
            className="rounded-button border-text-secondary hover:bg-text-secondary hover:text-bg-secondary inline-flex items-center border-2 px-8 py-3 text-sm font-medium tracking-wider text-white uppercase transition-colors"
          >
            Conoce mas
          </Link>
        </div>
      </div>
    </section>
  );
}
