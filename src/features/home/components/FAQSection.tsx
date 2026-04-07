"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Qué tipos de equipos de purificación ofrecen?",
    answer:
      "Ofrecemos una amplia gama de equipos de ósmosis inversa, filtros de agua, purificadores UV, ablandadores y sistemas de tratamiento para uso doméstico, comercial e industrial. También contamos con equipos especializados para acuarismo y cultivo indoor.",
  },
  {
    question: "¿Realizan envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a todo el territorio argentino. Los tiempos de entrega varían según la ubicación. Para más información sobre costos y tiempos de envío, no dudes en contactarnos.",
  },
  {
    question: "¿Tienen servicio técnico?",
    answer:
      "Contamos con servicio técnico especializado disponible 24/7, los 365 días del año. Nuestro equipo de profesionales está capacitado para la instalación, mantenimiento y reparación de todos los equipos que comercializamos.",
  },
  {
    question: "¿Cómo puedo saber qué equipo necesito?",
    answer:
      "Ofrecemos asesoramiento personalizado gratuito. Podés contactarnos por WhatsApp o teléfono y nuestros especialistas te ayudarán a elegir el equipo ideal según tus necesidades, presupuesto y tipo de uso.",
  },
  {
    question: "¿Qué garantía tienen los productos?",
    answer:
      "Todos nuestros productos cuentan con garantía oficial del fabricante. Además, ofrecemos soporte post-venta y mantenimiento preventivo para asegurar el óptimo funcionamiento de tu equipo.",
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
            ¿Tenés más preguntas?{" "}
            <a
              href="https://wa.me/5491136647107"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-text-secondary hover:underline"
            >
              ¡Contáctanos!
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
