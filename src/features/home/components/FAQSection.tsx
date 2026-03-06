"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Que tipos de equipos de purificacion ofrecen?",
    answer:
      "Ofrecemos una amplia gama de equipos de osmosis inversa, filtros de agua, purificadores UV, ablandadores y sistemas de tratamiento para uso domestico, comercial e industrial. Tambien contamos con equipos especializados para acuarismo y cultivo indoor.",
  },
  {
    question: "Realizan envios a todo el pais?",
    answer:
      "Si, realizamos envios a todo el territorio argentino. Los tiempos de entrega varian segun la ubicacion. Para mas informacion sobre costos y tiempos de envio, no dudes en contactarnos.",
  },
  {
    question: "Tienen servicio tecnico?",
    answer:
      "Contamos con servicio tecnico especializado disponible 24/7, los 365 dias del ano. Nuestro equipo de profesionales esta capacitado para la instalacion, mantenimiento y reparacion de todos los equipos que comercializamos.",
  },
  {
    question: "Como puedo saber que equipo necesito?",
    answer:
      "Ofrecemos asesoramiento personalizado gratuito. Podes contactarnos por WhatsApp o telefono y nuestros especialistas te ayudaran a elegir el equipo ideal segun tus necesidades, presupuesto y tipo de uso.",
  },
  {
    question: "Que garantia tienen los productos?",
    answer:
      "Todos nuestros productos cuentan con garantia oficial del fabricante. Ademas, ofrecemos soporte post-venta y mantenimiento preventivo para asegurar el optimo funcionamiento de tu equipo.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-bg-secondary py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-black uppercase text-white md:text-[64px]">
          Preguntas frecuentes
        </h2>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-dropdown border-none bg-card-light px-5"
              >
                <AccordionTrigger className="text-left font-bold text-text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-primary/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-center text-white/70">
            Tenes mas preguntas?{" "}
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-text-secondary hover:underline"
            >
              Contactanos!
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
