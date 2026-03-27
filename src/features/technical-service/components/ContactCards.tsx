import Link from "next/link";

export function ContactCards() {
  return (
    <section id="contacto" className="py-section-mobile md:py-section bg-bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading mb-10 text-4xl font-black uppercase text-center md:text-[64px] text-text-primary">
          Estamos para vos
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* WhatsApp Card */}
          <div className="flex flex-col items-start rounded-card border-2 border-border p-8">
            <img
              src="/whatsapp-icon.svg"
              alt="WhatsApp"
              className="mb-4 h-12 w-12"
            />
            <h3 className="font-heading mb-3 text-2xl font-black text-text-primary md:text-3xl">
              WhatsApp
            </h3>
            <p className="mb-6 text-base text-text-primary/80">
              Escribinos por WhatsApp y te respondemos a la brevedad. Disponibles
              los 365 días del año para atender tu consulta.
            </p>
            <Link
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-button bg-btn-primary px-6 py-3 text-sm font-medium tracking-wider text-text-secondary uppercase transition-colors hover:bg-btn-primary-hover"
            >
              Conocé más →
            </Link>
          </div>

          {/* Gmail Card */}
          <div className="flex flex-col items-start rounded-card border-2 border-border p-8">
            <img
              src="/gmail-icon.svg"
              alt="Gmail"
              className="mb-4 h-12 w-12"
            />
            <h3 className="font-heading mb-3 text-2xl font-black text-text-primary md:text-3xl">
              Gmail
            </h3>
            <p className="mb-6 text-base text-text-primary/80">
              Mandanos un mail con tu consulta o inconveniente y te asesoramos
              para encontrar la mejor solución para tu equipo.
            </p>
            <Link
              href="mailto:Thecoral_purificadores@outlook.es"
              className="rounded-button bg-btn-primary px-6 py-3 text-sm font-medium tracking-wider text-text-secondary uppercase transition-colors hover:bg-btn-primary-hover"
            >
              Conocé más →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
