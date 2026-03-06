import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/features/home/components/HeroSection";
import { AboutSection } from "@/features/home/components/AboutSection";
import { BrandsCarousel } from "@/features/home/components/BrandsCarousel";
import { ServicesSection } from "@/features/home/components/ServicesSection";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { FAQSection } from "@/features/home/components/FAQSection";
import { MiniBanner } from "@/features/home/components/MiniBanner";

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
      <AboutSection />
      <BrandsCarousel />
      <ServicesSection />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <FAQSection />
      <MiniBanner />
    </>
  );
}
