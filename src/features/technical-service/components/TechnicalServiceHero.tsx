import Link from "next/link";
import Image from "next/image";

export function TechnicalServiceHero() {
  return (
    <section className="relative -mt-16 flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#042F34] to-[#111C24]">
      {/* Background image */}
      <Image
        src="/banner-servicio-tecnico.jpg"
        alt="Servicio técnico especializado"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 container mx-auto px-4 py-32 flex flex-col items-center text-center">
        <h1 className="font-heading mb-6 text-5xl leading-[1.1] font-black text-white uppercase md:text-[96px]">
          Servicio Técnico
        </h1>

        <p className="mb-10 max-w-xl text-base text-white/90 md:text-2xl">
          Realizamos mantenimiento preventivo y correctivo de equipos de
          ósmosis inversa, tanto de The Coral Garden como de otras marcas.
        </p>

        <Link
          href="#contacto"
          className="rounded-button inline-flex items-center border-2 border-text-secondary px-8 py-3 text-sm font-medium tracking-wider text-text-secondary uppercase transition-colors hover:bg-text-secondary/10"
        >
          Contáctanos →
        </Link>
      </div>
    </section>
  );
}
