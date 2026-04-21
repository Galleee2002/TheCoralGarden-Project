import Image from "next/image";

const brands = [
  "/marca-1.png",
  "/marca-2.png",
  "/marca-3.png",
  "/marca-4.png",
  "/marca-5.png",
];

export function BrandsCarousel() {
  // 2 copies, animating -50% (= 1 copy) for seamless loop
  const allBrands = [...brands, ...brands];

  return (
    <section className="bg-bg-secondary overflow-hidden py-10">
      <div className="animate-brands-scroll flex w-max items-center gap-16">
        {allBrands.map((src, i) => (
          <div key={i} className="relative h-12 w-32 shrink-0 sm:h-14 sm:w-40 transition-transform duration-300 hover:scale-110">
            <Image
              src={src}
              alt={`Marca ${(i % brands.length) + 1}`}
              fill
              className="object-contain opacity-70 brightness-0 invert transition-opacity duration-300 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
