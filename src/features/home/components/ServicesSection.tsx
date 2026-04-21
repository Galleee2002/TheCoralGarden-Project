import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getSetting } from "@/features/admin/actions/settingActions";

type ServiceImageSettingKey =
  | "service_venta_image"
  | "service_postventa_image"
  | "service_reparacion_image";

const services: Array<{
  title: string;
  number: string;
  surface: string;
  eyebrow: string;
  titleClass: string;
  descriptionClass: string;
  imageShell: string;
  imageAccent: string;
  marker: string;
  cta: string;
  divider: string;
  description: string;
  settingKey: ServiceImageSettingKey;
  fallbackImage: string;
}> = [
  {
    title: "Venta y asesoramiento",
    number: "01",
    surface: "bg-card-dark text-white",
    eyebrow: "text-text-secondary",
    titleClass: "text-white",
    descriptionClass: "text-white/75",
    imageShell: "bg-white/8 border-white/15",
    imageAccent: "bg-text-secondary",
    marker: "bg-text-secondary",
    cta: "border-text-secondary text-white hover:bg-text-secondary hover:text-bg-secondary focus-visible:ring-text-secondary",
    divider: "bg-text-secondary/40",
    description:
      "Te ayudamos a elegir el equipo ideal para tus necesidades. Asesoramiento personalizado con profesionales especializados.",
    settingKey: "service_venta_image",
    fallbackImage: "/service-venta-image.png",
  },
  {
    title: "Servicio post venta",
    number: "02",
    surface: "bg-card-light text-text-primary",
    eyebrow: "text-bg-secondary",
    titleClass: "text-text-primary",
    descriptionClass: "text-text-primary/75",
    imageShell: "bg-bg-primary border-bg-secondary/10",
    imageAccent: "bg-bg-secondary",
    marker: "bg-bg-secondary",
    cta: "border-bg-secondary text-bg-secondary hover:bg-bg-secondary hover:text-white focus-visible:ring-bg-secondary",
    divider: "bg-bg-secondary/30",
    description:
      "Acompañamiento continuo después de tu compra. Mantenimiento preventivo y soporte técnico garantizado.",
    settingKey: "service_postventa_image",
    fallbackImage: "/service-postventa-image.png",
  },
  {
    title: "Reparación y mantenimiento",
    number: "03",
    surface: "bg-[#111C24] text-white",
    eyebrow: "text-chart-3",
    titleClass: "text-white",
    descriptionClass: "text-white/75",
    imageShell: "bg-white/8 border-white/15",
    imageAccent: "bg-chart-3",
    marker: "bg-chart-3",
    cta: "border-chart-3 text-white hover:bg-chart-3 hover:text-text-primary focus-visible:ring-chart-3",
    divider: "bg-chart-3/45",
    description:
      "Servicio técnico especializado en reparación y mantenimiento de equipos de ósmosis inversa y purificación de agua.",
    settingKey: "service_reparacion_image",
    fallbackImage: "/service-reparacion-image.png",
  },
];

export async function ServicesSection() {
  const [ventaImage, postventaImage, reparacionImage] = await Promise.all([
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
  ]);

  const imageBySettingKey = {
    service_venta_image: ventaImage,
    service_postventa_image: postventaImage,
    service_reparacion_image: reparacionImage,
  } as const;

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

        <div className="grid gap-4 lg:gap-5">
          {services.map((service, index) => (
            <RevealOnScroll
              key={service.title}
              direction="right"
              delay={index * 0.08}
              distance={24}
              className="group"
            >
              <article
                className={`rounded-card grid overflow-hidden ${service.surface} shadow-[0_18px_50px_rgba(4,47,52,0.08)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-1 md:min-h-[196px] md:grid-cols-[190px_minmax(0,1fr)_104px] lg:grid-cols-[240px_minmax(0,1fr)_132px]`}
              >
                <div
                  className={`relative aspect-[16/9] overflow-hidden border-b ${service.imageShell} md:aspect-auto md:border-r md:border-b-0`}
                >
                  <Image
                    src={
                      imageBySettingKey[service.settingKey] ||
                      service.fallbackImage
                    }
                    alt={`Servicio de ${service.title.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 768px) 190px, 100vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                  <div
                    className={`absolute top-4 left-4 h-2 w-14 rounded-full ${service.imageAccent} motion-safe:origin-left motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-x-125`}
                    aria-hidden="true"
                  />
                </div>

                <div className="flex min-w-0 flex-col justify-center p-6 sm:p-7 lg:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${service.marker}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xs font-bold tracking-[0.18em] uppercase ${service.eyebrow}`}
                    >
                      Servicio {service.number}
                    </span>
                  </div>
                  <h3
                    className={`font-heading text-2xl leading-[1.05] font-black uppercase md:text-3xl ${service.titleClass}`}
                  >
                    {service.title}
                  </h3>
                  <div
                    className={`my-4 h-px w-full max-w-md ${service.divider}`}
                    aria-hidden="true"
                  />
                  <p
                    className={`max-w-3xl text-sm leading-relaxed sm:text-base ${service.descriptionClass}`}
                  >
                    {service.description}
                  </p>
                  <Link
                    href="/servicio-tecnico"
                    aria-label={`Conocé más sobre ${service.title}`}
                    className={`rounded-button mt-6 inline-flex min-h-11 w-fit items-center justify-center border-2 px-6 py-2.5 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none ${service.cta}`}
                  >
                    Conocé más
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-current/10 px-6 py-5 md:flex-col md:items-end md:justify-between md:border-t-0 md:border-l md:px-6 md:py-7 lg:px-8">
                  <span
                    className={`font-heading text-5xl leading-none font-black ${service.eyebrow} md:text-6xl lg:text-7xl`}
                    aria-hidden="true"
                  >
                    {service.number}
                  </span>
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <span
                      className={`h-5 w-14 rounded-full ${service.marker}`}
                    />
                    <span className="h-5 w-8 rounded-full bg-current/15" />
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
