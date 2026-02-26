import { HeroSection } from "@/features/home/components/HeroSection";
import { ValueProposition } from "@/features/home/components/ValueProposition";
import { UseCasesGrid } from "@/features/home/components/UseCasesGrid";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { TechnicalServiceBanner } from "@/features/home/components/TechnicalServiceBanner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FeaturedProductsSkeleton() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4">
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
      <HeroSection />
      <ValueProposition />
      <UseCasesGrid />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <TechnicalServiceBanner />
    </>
  );
}
