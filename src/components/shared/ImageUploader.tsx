"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  label?: string;
}

export function ImageUploader({ onUpload, label = "Subir imagen" }: ImageUploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result) => {
        if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
          onUpload(result.info.secure_url as string);
        }
      }}
      options={{ maxFiles: 1, resourceType: "image" }}
    >
      {({ open }) => (
        <Button type="button" variant="outline" onClick={() => open()}>
          <ImagePlus className="mr-2 h-4 w-4" />
          {label}
        </Button>
      )}
    </CldUploadWidget>
  );
}
