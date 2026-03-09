"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const specialties = [
  {
    label: "Acuarismo",
    bg: "bg-[#1a3a4a]",
    description:
      "Sistemas de purificación para acuarios marinos y dulceacuícolas. Agua de calidad certificada para cada ecosistema.",
  },
  {
    label: "Cannabis",
    bg: "bg-[#1a3a20]",
    description:
      "Agua ultra-pura para cultivos indoor con control preciso de EC y pH para maximizar el rendimiento.",
  },
  {
    label: "Piletas",
    bg: "bg-[#0d2d3d]",
    description:
      "Tratamiento y filtración avanzada para piletas residenciales y comerciales. Agua limpia, segura y cristalina.",
  },
];

export function SpecialtiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-bg-primary py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <h2 className="font-heading mb-10 text-[48px] uppercase leading-none text-text-primary md:mb-14 md:text-[64px]">
          NUESTRAS ESPECIALIDADES
        </h2>

        {/* Mobile: stacked */}
        <div className="flex flex-col gap-4 md:hidden">
          {specialties.map((specialty) => (
            <div
              key={specialty.label}
              className={`relative h-[300px] overflow-hidden rounded-card ${specialty.bg}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 z-10">
                <span
                  className="font-heading text-4xl font-black uppercase tracking-wider text-white"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {specialty.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: accordion horizontal */}
        <div className="hidden h-[680px] gap-3 md:flex">
          {specialties.map((specialty, i) => {
            const isHovered = hoveredIndex === i;
            const isOtherHovered = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={specialty.label}
                className="flex min-w-0 flex-row"
                style={{
                  flexGrow: isHovered ? 2.5 : isOtherHovered ? 0.6 : 1,
                  flexShrink: 1,
                  flexBasis: "0%",
                  transition:
                    "flex-grow 0.55s cubic-bezier(0.32, 0.72, 0, 1)",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Info panel — aparece a la izquierda de la card */}
                <motion.div
                  className="flex flex-col justify-end overflow-hidden bg-card-light"
                  animate={{
                    width: isHovered ? 210 : 0,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{
                    width: {
                      duration: 0.45,
                      ease: [0.32, 0.72, 0, 1],
                    },
                    opacity: {
                      duration: isHovered ? 0.3 : 0.15,
                      delay: isHovered ? 0.15 : 0,
                    },
                  }}
                  style={{
                    flexShrink: 0,
                    borderRadius:
                      "var(--radius-card) 0 0 var(--radius-card)",
                  }}
                >
                  <div className="w-[210px] p-6 pb-8">
                    <h3 className="font-heading mb-3 text-2xl uppercase text-text-primary">
                      {specialty.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-primary/80">
                      {specialty.description}
                    </p>
                  </div>
                </motion.div>

                {/* Card face */}
                <div
                  className={`relative min-w-[70px] flex-1 overflow-hidden ${specialty.bg}`}
                  style={{
                    borderRadius: isHovered
                      ? "0 var(--radius-card) var(--radius-card) 0"
                      : "var(--radius-card)",
                    transition:
                      "border-radius 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
                    <span
                      className="font-heading text-5xl font-black uppercase tracking-wider text-white"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {specialty.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
