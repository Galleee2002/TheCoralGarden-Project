import Image from "next/image";

const brands = [
  "/marca-1.png",
  "/marca-2.png",
  "/marca-3.png",
  "/marca-4.png",
  "/marca-5.png",
  "/marca-6.png",
];

export function BrandsCarousel() {
  // Duplicate for seamless infinite loop
  const allBrands = [...brands, ...brands];

  return (
    <section className="overflow-hidden bg-bg-secondary py-10">
      <div
        className="flex items-center gap-16"
        style={{
          animation: "scroll 25s linear infinite",
          width: "max-content",
        }}
      >
        {allBrands.map((src, i) => (
          <div key={i} className="relative h-12 w-32 shrink-0 sm:h-14 sm:w-40">
            <Image
              src={src}
              alt={`Marca ${(i % brands.length) + 1}`}
              fill
              className="object-contain brightness-0 invert opacity-70"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
