"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-muted">
        <ImageOff className="h-20 w-20 text-muted-foreground" />
      </div>
    );
  }

  const thumbnails = images.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails — max 3, equal width */}
      {thumbnails.length > 1 && (
        <div className="flex gap-2">
          {thumbnails.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-24 flex-1 overflow-hidden rounded-lg border-2 transition-all",
                i === selected
                  ? "border-card-light"
                  : "border-transparent hover:border-card-light",
              )}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
