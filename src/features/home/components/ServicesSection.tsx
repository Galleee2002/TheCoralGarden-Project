import Link from "next/link";
import Image from "next/image";
import { getSetting } from "@/features/admin/actions/settingActions";

const services = [
  {
    title: "Venta y asesoramiento",
    bg: "bg-card-dark",
    text: "text-white",
    textMuted: "text-white/70",
    description:
      "Te ayudamos a elegir el equipo ideal para tus necesidades. Asesoramiento personalizado con profesionales especializados.",
  },
  {
    title: "Servicio post venta",
    bg: "bg-card-light",
    text: "text-text-primary",
    textMuted: "text-text-primary/70",
    description:
      "Acompañamiento continuo después de tu compra. Mantenimiento preventivo y soporte técnico garantizado.",
  },
  {
    title: "Reparación y mantenimiento",
    bg: "bg-[#111C24]",
    text: "text-white",
    textMuted: "text-white/70",
    description:
      "Servicio técnico especializado en reparación y mantenimiento de equipos de ósmosis inversa y purificación de agua.",
  },
];

export async function ServicesSection() {
  const [ventaImage, postventaImage, reparacionImage] = await Promise.all([
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
  ]);

  const servicesWithImages = services.map((service, index) => ({
    ...service,
    image: [ventaImage, postventaImage, reparacionImage][index],
  }));

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
          {servicesWithImages.map((service, index) => (
            <div
              key={service.title}
              className={`rounded-card relative flex min-h-[260px] flex-col p-8 text-center lg:min-h-[420px] lg:justify-end lg:overflow-hidden lg:text-left ${service.bg} ${
                index === 2 ? "lg:col-span-2 lg:mx-auto lg:w-[calc(50%-12px)]" : ""
              }`}
            >
              {service.image && (
                <>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="hidden object-cover lg:block"
                  />
                  <div className="absolute inset-0 hidden bg-linear-to-t from-black/65 via-black/25 to-white/10 lg:block" />
                </>
              )}
              <div className="relative z-10 flex flex-1 flex-col items-center lg:hidden">
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
                className="rounded-button border-text-secondary hover:bg-text-secondary hover:text-bg-secondary relative z-10 mt-auto inline-flex w-fit self-center border-2 px-6 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-colors lg:self-start"
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
