"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, RefreshCw } from "lucide-react";
import Image from "next/image";

export function ProductTabMedia() {
  const form = useFormContext();
  const images: string[] = form.watch("images") ?? [];

  const mainImage = images[0] ?? null;
  const previewImages = images.slice(1, 4); // max 3 previews

  const setMainImage = (url: string) => {
    form.setValue("images", [url, ...images.slice(1)], { shouldValidate: true });
  };

  const removeMainImage = () => {
    form.setValue("images", images.slice(1), { shouldValidate: true });
  };

  const addPreview = (url: string) => {
    const previews = images.slice(1, 4);
    if (previews.length >= 3) return;
    const main = images[0];
    const next = main ? [main, ...previews, url] : [...previews, url];
    form.setValue("images", next, { shouldValidate: true });
  };

  const removePreview = (previewIndex: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== previewIndex);
    form.setValue("images", [mainImage, ...newPreviews].filter(Boolean) as string[], {
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <div className="space-y-8">
          {/* Main image */}
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Imagen principal
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (se muestra en la tarjeta y encabezado del producto)
              </span>
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {mainImage ? (
                  <div className="relative h-48 w-48 overflow-hidden rounded-card border">
                    <Image src={mainImage} alt="Imagen principal" fill className="object-cover" />
                    <div className="absolute right-1 top-1 flex gap-1">
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        onSuccess={(result) => {
                          if (
                            result.info &&
                            typeof result.info === "object" &&
                            "secure_url" in result.info
                          ) {
                            setMainImage(result.info.secure_url as string);
                          }
                        }}
                        options={{ maxFiles: 1, resourceType: "image" }}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                            title="Reemplazar imagen"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        )}
                      </CldUploadWidget>
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                        title="Quitar imagen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result) => {
                      if (
                        result.info &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        setMainImage(result.info.secure_url as string);
                      }
                    }}
                    options={{ maxFiles: 1, resourceType: "image" }}
                  >
                    {({ open }) => (
                      <Button type="button" variant="outline" onClick={() => open()}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Subir imagen principal
                      </Button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* Preview images */}
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Imágenes preview
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (galería en la página del producto — máx. 3)
              </span>
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {previewImages.map((url, i) => (
                      <div
                        key={i}
                        className="relative h-24 w-24 overflow-hidden rounded-card border"
                      >
                        <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {previewImages.length < 3 && (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result) => {
                      if (
                        result.info &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        addPreview(result.info.secure_url as string);
                      }
                    }}
                    options={{ maxFiles: 1, resourceType: "image" }}
                  >
                    {({ open }) => (
                      <Button type="button" variant="outline" onClick={() => open()}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Agregar imagen preview
                        {previewImages.length > 0 && (
                          <span className="ml-1 text-muted-foreground">
                            ({previewImages.length}/3)
                          </span>
                        )}
                      </Button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </FormControl>
          </FormItem>
        </div>
      )}
    />
  );
}
