"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleCheckBig, ChevronLeft, ChevronRight } from "lucide-react";

export interface SlideData {
  image: string | null;
  title: string;
  features?: string[];
  description?: string;
}

const INTERVAL_MS = 5000;

export function HeroSlider({ slides }: { slides: SlideData[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative -mt-16 min-h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== current}
          className={`absolute inset-0 flex items-center transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background */}
          {slide.image ? (
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#042F34] via-[#063B41] to-[#111C24]" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-32">
            <div className="max-w-5xl">
              <h1 className="font-heading mb-8 text-5xl leading-[1.1] font-black text-white uppercase md:text-[96px]">
                {slide.title}
              </h1>

              {slide.features ? (
                <ul className="mb-10 flex flex-col gap-4">
                  {slide.features.map((text) => (
                    <li key={text} className="flex items-center gap-3">
                      <CircleCheckBig className="h-[28px] w-[28px] shrink-0 text-white" />
                      <span className="text-base font-medium text-white/90 md:text-2xl">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : slide.description ? (
                <p className="mb-10 max-w-2xl text-base font-medium text-white/90 md:text-2xl">
                  {slide.description}
                </p>
              ) : null}

              <Link
                href="/productos"
                className="rounded-button border-text-secondary hover:bg-text-secondary hover:text-bg-secondary inline-flex items-center border-2 px-8 py-3 text-sm font-medium tracking-wider text-white uppercase transition-colors"
              >
                Conocé más
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2  p-2 text-white transition-colors "
        aria-label="Siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
