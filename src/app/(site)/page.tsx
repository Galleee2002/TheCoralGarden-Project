import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/features/home/components/HeroSection";
import { AboutSection } from "@/features/home/components/AboutSection";
import { BrandsCarousel } from "@/features/home/components/BrandsCarousel";
import { ServicesSection } from "@/features/home/components/ServicesSection";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { MiniBanner } from "@/features/home/components/MiniBanner";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { Metadata } from "next";

const FAQSection = dynamic(
  () => import("@/features/home/components/FAQSection").then((m) => ({ default: m.FAQSection }))
);

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

function FeaturedProductsSkeleton() {
  return (
    <section className="bg-bg-secondary py-section-mobile md:py-section">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Skeleton className="mb-2 h-8 w-64 bg-white/10" />
          <Skeleton className="h-5 w-48 bg-white/10" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card">
              <Skeleton className="aspect-square w-full bg-white/10" />
              <div className="bg-card-default p-4">
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#042F34] via-[#063B41] to-[#111C24]" />}>
        <HeroSection />
      </Suspense>
      <RevealOnScroll>
        <AboutSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.05}>
        <BrandsCarousel />
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <ServicesSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0.15}>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </RevealOnScroll>
      <RevealOnScroll direction="fade" delay={0.2}>
        <FAQSection />
      </RevealOnScroll>
      <RevealOnScroll direction="up" delay={0.1}>
        <MiniBanner />
      </RevealOnScroll>
    </>
  );
}
