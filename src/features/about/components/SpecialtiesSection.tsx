"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const specialties = [
  {
    id: "acuarismo",
    label: "Acuarismo",
    bg: "bg-[#1a3a4a]",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=1200",
    description:
      "Sistemas de purificación para acuarios marinos y dulceacuícolas. Agua de calidad certificada para cada ecosistema.",
  },
  {
    id: "cultivo",
    label: "Cultivo",
    bg: "bg-[#1a3a20]",
    image: "https://plus.unsplash.com/premium_photo-1680322473513-7794fc236ae5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Agua ultra-pura para cultivos indoor con control preciso de EC y pH para maximizar el rendimiento.",
  },
  {
    id: "piletas",
    label: "Piletas",
    bg: "bg-[#0d2d3d]",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200",
    description:
      "Tratamiento y filtración avanzada para piletas residenciales y comerciales. Agua limpia, segura y cristalina.",
  },
];

export function SpecialtiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-bg-primary overflow-hidden py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={prefersReducedMotion ? undefined : { duration: 0.6 }}
          className="font-heading mb-10 text-[48px] uppercase leading-none text-text-primary md:mb-14 md:text-[64px]"
        >
          NUESTRAS ESPECIALIDADES
        </motion.h2>

        {/* Mobile: stacked cards with subtle hover/touch effect */}
        <div className="flex flex-col gap-6 md:hidden">
          {specialties.map((specialty, i) => (
            <motion.div
              key={specialty.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative h-[350px] overflow-hidden rounded-card shadow-xl",
                specialty.bg
              )}
            >
              <motion.img
                src={specialty.image}
                alt={specialty.label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-60"
                animate={prefersReducedMotion ? undefined : { opacity: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="font-heading mb-3 text-4xl font-black uppercase tracking-wider text-white">
                  {specialty.label}
                </h3>
                <p className="font-body max-w-[80%] text-sm leading-relaxed text-white/90">
                  {specialty.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: Horizontal Interactive Accordion */}
        <div className="hidden h-[600px] gap-4 md:flex">
          {specialties.map((specialty, i) => {
            const isHovered = hoveredIndex === i;
            
            return (
              <motion.button
                key={specialty.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setHoveredIndex((current) => (current === i ? null : i));
                  }
                }}
                type="button"
                aria-pressed={isHovered}
                aria-label={`Mostrar detalle de ${specialty.label}`}
                className={cn(
                  "relative flex h-full cursor-pointer flex-col overflow-hidden rounded-card text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                  isHovered ? "flex-[3]" : "flex-1"
                )}
                layout
              >
                {/* Background Image Container */}
                <div className={cn(
                  "absolute inset-0 transition-all duration-700",
                  specialty.bg
                )}>
                  <motion.img
                    src={specialty.image}
                    alt={specialty.label}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            scale: isHovered ? 1.05 : 1.1,
                            opacity: isHovered ? 0.6 : 0.4,
                            filter: isHovered ? "grayscale(0%)" : "grayscale(30%)",
                          }
                    }
                    transition={prefersReducedMotion ? undefined : { duration: 0.7 }}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500",
                    isHovered ? "opacity-100" : "opacity-80"
                  )} />
                </div>

                {/* Vertical Label (When not hovered) */}
                <AnimatePresence>
                  {!isHovered && (
                    <motion.div
                      key="vertical-label"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute inset-y-0 left-0 flex w-24 items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]"
                    >
                      <span
                        className="font-heading text-5xl font-black uppercase tracking-[0.25em] text-white whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {specialty.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-12">
                  <motion.div
                    animate={{
                      x: isHovered ? 0 : -40,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 0.6,
                            ease: [0.32, 0.72, 0, 1],
                            delay: isHovered ? 0.2 : 0,
                          }
                    }
                    className="max-w-xl"
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <div className="h-[2px] w-12 bg-accent" />
                      <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-accent">
                        Especialidad
                      </span>
                    </div>
                    
                    <h3 className="font-heading mb-6 text-7xl font-black uppercase leading-[0.8] tracking-tighter text-white">
                      {specialty.label}
                    </h3>
                    
                    <p className="font-body max-w-md text-xl leading-relaxed text-white/90">
                      {specialty.description}
                    </p>
                    
                    <motion.span
                      whileHover={prefersReducedMotion ? undefined : { x: 10 }}
                      className="font-body mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white group"
                    >
                      Ver detalle
                      <span className="h-[1px] w-8 bg-white transition-all group-hover:w-12" />
                    </motion.span>
                  </motion.div>
                </div>
                
                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-white/0 pointer-events-none"
                  animate={{
                    borderColor: isHovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
                  }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.5 }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
