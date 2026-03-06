"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function MultiImageUploader({ value, onChange }: MultiImageUploaderProps) {
  const handleUpload = (url: string) => {
    onChange([...value, url]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative h-24 w-24 overflow-hidden rounded-md border">
              <Image src={url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
            handleUpload(result.info.secure_url as string);
          }
        }}
        options={{ maxFiles: 10, resourceType: "image" }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Agregar imagen
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
