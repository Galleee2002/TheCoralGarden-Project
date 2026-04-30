import Image from "next/image";

export function AboutHero() {
  return (
    <section className="bg-bg-primary py-section-mobile md:py-section">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Imagen */}
          <div className="relative aspect-3/4 overflow-hidden rounded-card lg:aspect-auto lg:min-h-[600px]">
            <Image
              src="/profile-coral-garden.jpeg"
              alt="Fundadores de The Coral Garden"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contenido */}
          <div className="flex flex-col gap-6">
            <h1 className="font-heading text-4xl uppercase leading-none text-text-primary sm:text-5xl md:text-[80px]">
              THE CORAL GARDEN
            </h1>
            <div className="flex flex-col gap-4 text-base text-text-primary/80 [&_strong]:font-bold [&_strong]:text-text-primary">
              <p>
                Somos una empresa fundada en 2013, especializada en soluciones
                de{" "}
                <strong>tratamiento y purificación del agua.</strong>
              </p>
              <p>
                Nacimos desde la pasión por el acuarismo, convencidos de que la{" "}
                <strong>calidad del agua</strong> es el{" "}
                <strong>factor clave</strong> para el éxito de cualquier
                ecosistema acuático o cultivo vivo.
              </p>
              <p>
                Luego de años de experiencia, expandimos nuestro alcance hacia
                otros sectores que comparten esa misma exigencia:{" "}
                <strong>pureza, estabilidad y seguridad del agua.</strong>
              </p>
              <p>
                Hoy somos distribuidores de las principales marcas del rubro y
                brindamos soluciones confiables para:
              </p>
              <ul className="list-inside list-disc">
                <li>Acuarismo</li>
                <li>Cultivo indoor</li>
                <li>Uso doméstico y comercial</li>
                <li>Aplicaciones industriales</li>
              </ul>
              <p>
                Nuestro compromiso es siempre entregar{" "}
                <strong>calidad, confianza y bienestar</strong> en cada
                proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
