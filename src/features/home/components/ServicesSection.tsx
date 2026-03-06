import Link from "next/link";
import Image from "next/image";
import { getSetting } from "@/features/admin/actions/settingActions";

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

export async function ServicesSection() {
  const [ventaImage, postventaImage, reparacionImage] = await Promise.all([
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
  ]);

  const serviceImages = [ventaImage, postventaImage];

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

        {/* Top 2 cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`rounded-card relative flex flex-col overflow-hidden p-8 ${service.bg}`}
              style={{ minHeight: "320px" }}
            >
              <div className="flex-1">
                <h3
                  className={`font-heading mb-3 text-2xl font-bold ${service.text}`}
                >
                  {service.title}
                </h3>
                <p className={`mb-6 leading-relaxed ${service.textMuted}`}>
                  {service.description}
                </p>
              </div>
              <Link
                href="/servicio-tecnico"
                className={`rounded-button relative z-10 mt-auto inline-flex w-fit items-center border-2 px-6 py-2.5 text-sm font-bold tracking-wider uppercase transition-colors ${service.borderColor} ${service.text} ${service.hoverBg}`}
              >
                Conoce mas
              </Link>
              {serviceImages[i] && (
                <div className="absolute right-0 bottom-0 h-[55%] w-[55%] overflow-hidden rounded-tl-lg">
                  <Image
                    src={serviceImages[i]!}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom card — same style as top cards */}
        <div className="mt-6 flex justify-center">
          <div
            className="rounded-card relative flex w-full flex-col overflow-hidden bg-[#111C24] p-8 sm:w-[calc(50%-12px)]"
            style={{ minHeight: "320px" }}
          >
            {/* Text content */}
            <div className="flex-1">
              <h3 className="font-heading mb-3 text-2xl font-bold text-white">
                Reparacion y mantenimiento
              </h3>
              <p className="mb-6 leading-relaxed text-white/70">
                Servicio tecnico especializado en reparacion y mantenimiento de
                equipos de osmosis inversa y purificacion de agua. Disponible
                24/7 los 365 dias del ano.
              </p>
            </div>
            {/* Button — bottom-left */}
            <Link
              href="/servicio-tecnico"
              className="rounded-button border-text-secondary hover:bg-text-secondary hover:text-bg-secondary relative z-10 mt-auto inline-flex w-fit items-center border-2 px-6 py-2.5 text-sm font-bold tracking-wider text-white uppercase transition-colors"
            >
              Conoce mas
            </Link>
            {/* Image — absolutely positioned bottom-right, only top-left radius */}
            {reparacionImage && (
              <div className="absolute right-0 bottom-0 h-[55%] w-[55%] overflow-hidden rounded-tl-lg">
                <Image
                  src={reparacionImage}
                  alt="Reparacion y mantenimiento"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
