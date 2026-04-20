import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Venta y asesoramiento",
    bg: "bg-card-dark",
    text: "text-white",
    textMuted: "text-white/70",
    description:
      "Te ayudamos a elegir el equipo ideal para tus necesidades. Asesoramiento personalizado con profesionales especializados.",
    cornerImage: "/service-venta-image.png",
  },
  {
    title: "Servicio post venta",
    bg: "bg-card-light",
    text: "text-text-primary",
    textMuted: "text-text-primary/70",
    description:
      "Acompañamiento continuo después de tu compra. Mantenimiento preventivo y soporte técnico garantizado.",
    cornerImage: "/service-postventa-image.png",
  },
  {
    title: "Reparación y mantenimiento",
    bg: "bg-[#111C24]",
    text: "text-white",
    textMuted: "text-white/70",
    description:
      "Servicio técnico especializado en reparación y mantenimiento de equipos de ósmosis inversa y purificación de agua.",
    cornerImage: "/service-reparacion-image.png",
  },
];

export function ServicesSection() {
  return (
    <section className="py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-text-primary text-3xl font-black uppercase md:text-[64px]">
            Nuestros servicios
          </h2>
          <p className="text-text-primary/70 mt-3 text-base">
            Impulsamos cada proyecto con sistemas de filtración y ósmosis
            inversa diseñados para garantizar agua pura, estable y segura en
            cualquier aplicación.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`rounded-card relative flex min-h-[260px] flex-col overflow-hidden p-8 text-center ${service.bg} ${
                index === 2 ? "lg:col-span-2 lg:mx-auto lg:w-[calc(50%-12px)]" : ""
              }`}
            >
              <div className="relative z-10 flex flex-1 flex-col items-center">
                <h3
                  className={`font-heading mb-3 text-2xl font-bold ${service.text}`}
                >
                  {service.title}
                </h3>
                <p className={`mb-6 leading-relaxed ${service.textMuted}`}>
                  {service.description}
                </p>
              </div>

              <Image
                src={service.cornerImage}
                alt=""
                width={120}
                height={120}
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-auto w-20 object-contain opacity-90 sm:w-24 md:w-28"
              />

              <Link
                href="/servicio-tecnico"
                className="rounded-button border-text-secondary hover:bg-text-secondary hover:text-bg-secondary relative z-10 mt-auto inline-flex w-fit self-center border-2 px-6 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-colors"
              >
                Conocé más
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
