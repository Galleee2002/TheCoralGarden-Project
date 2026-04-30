import Link from "next/link";
import Image from "next/image";

export function TechnicalServiceHero() {
  return (
    <section className="bg-linear-to-br relative -mt-16 flex min-h-[85vh] items-center overflow-x-clip overflow-y-hidden from-[#042F34] to-[#111C24] md:min-h-screen">
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

      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col items-center px-4 py-24 text-center md:py-32">
        <h1 className="font-heading mb-6 text-4xl leading-[1.05] font-black text-white uppercase sm:text-5xl md:text-[96px]">
          Servicio Técnico
        </h1>

        <p className="mb-8 max-w-xl text-sm text-white/90 sm:text-base md:mb-10 md:text-2xl">
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
