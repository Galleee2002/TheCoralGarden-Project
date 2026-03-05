import Link from "next/link";

const services = [
  {
    title: "Venta y asesoramiento",
    description:
      "Te ayudamos a elegir el equipo ideal para tus necesidades. Asesoramiento personalizado con profesionales especializados.",
    bg: "bg-card-dark",
    text: "text-white",
    textMuted: "text-white/70",
    borderColor: "border-text-secondary",
    hoverBg: "hover:bg-text-secondary hover:text-bg-secondary",
  },
  {
    title: "Servicio post venta",
    description:
      "Acompanamiento continuo despues de tu compra. Mantenimiento preventivo y soporte tecnico garantizado.",
    bg: "bg-card-light",
    text: "text-text-primary",
    textMuted: "text-text-primary/70",
    borderColor: "border-btn-primary",
    hoverBg: "hover:bg-btn-primary hover:text-white",
  },
];

export function ServicesSection() {
  return (
    <section className="py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-black uppercase text-text-primary sm:text-4xl">
            Nuestros servicios
          </h2>
          <p className="mt-3 text-text-primary/70">
            Soluciones integrales para cada necesidad
          </p>
        </div>

        {/* Top 2 cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className={`flex flex-col justify-between rounded-card p-8 ${service.bg}`}
            >
              <div>
                <h3 className={`mb-3 font-heading text-2xl font-bold ${service.text}`}>
                  {service.title}
                </h3>
                <p className={`mb-6 leading-relaxed ${service.textMuted}`}>
                  {service.description}
                </p>
              </div>
              {/* Placeholder image area */}
              <div className="mb-6 aspect-video w-full rounded-lg bg-black/10" />
              <Link
                href="/servicio-tecnico"
                className={`inline-flex w-fit items-center rounded-button border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${service.borderColor} ${service.text} ${service.hoverBg}`}
              >
                Conoce mas
              </Link>
            </div>
          ))}
        </div>

        {/* Full-width bottom card */}
        <div className="mt-6 grid overflow-hidden rounded-card bg-[#111C24] sm:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h3 className="mb-3 font-heading text-2xl font-bold text-white">
              Reparacion y mantenimiento
            </h3>
            <p className="mb-6 leading-relaxed text-white/70">
              Servicio tecnico especializado en reparacion y mantenimiento de
              equipos de osmosis inversa y purificacion de agua. Disponible
              24/7 los 365 dias del ano.
            </p>
            <Link
              href="/servicio-tecnico"
              className="inline-flex w-fit items-center rounded-button border-2 border-text-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-text-secondary hover:text-bg-secondary"
            >
              Conoce mas
            </Link>
          </div>
          {/* Placeholder image */}
          <div className="aspect-video bg-white/5 sm:aspect-auto" />
        </div>
      </div>
    </section>
  );
}
