import Image from "next/image";

const brands = [
  "/marca-1.png",
  "/marca-2.png",
  "/marca-3.png",
  "/marca-4.png",
  "/marca-5.png",
];

export function BrandsCarousel() {
  // 4 copies so content always exceeds viewport width, animating -25% (= 1 copy) for seamless loop
  const allBrands = [...brands, ...brands, ...brands, ...brands];

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
