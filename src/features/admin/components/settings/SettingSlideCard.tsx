"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { upsertSetting } from "@/features/admin/actions/settingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { X, Save } from "lucide-react";

interface SettingSlideCardProps {
  slideIndex: number;
  currentImage: string | null;
  currentTitle: string | null;
  currentDescription: string | null;
  currentFeatures?: string | null;
}

export function SettingSlideCard({
  slideIndex,
  currentImage,
  currentTitle,
  currentDescription,
  currentFeatures,
}: SettingSlideCardProps) {
  const prefix = `hero_slide${slideIndex}`;
  const [image, setImage] = useState(currentImage);
  const [title, setTitle] = useState(currentTitle ?? "");
  const [description, setDescription] = useState(currentDescription ?? "");
  const [features, setFeatures] = useState(currentFeatures ?? "");
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (url: string) => {
    setImage(url);
    setSaving(true);
    const result = await upsertSetting({ key: `${prefix}_image`, value: url });
    setSaving(false);
    if (result?.data) {
      toast.success("Imagen actualizada");
    } else {
      toast.error("Error al guardar la imagen");
    }
  };

  const handleRemoveImage = async () => {
    setSaving(true);
    const result = await upsertSetting({ key: `${prefix}_image`, value: "" });
    setSaving(false);
    if (result?.data) {
      setImage(null);
      toast.success("Imagen eliminada");
    } else {
      toast.error("Error al eliminar la imagen");
    }
  };

  const handleSaveText = async () => {
    setSaving(true);
    const [r1, r2, r3] = await Promise.all([
      upsertSetting({ key: `${prefix}_title`, value: title }),
      upsertSetting({ key: `${prefix}_features`, value: features }),
      upsertSetting({ key: `${prefix}_description`, value: description }),
    ]);
    setSaving(false);
    if (r1?.data && r2?.data && r3?.data) {
      toast.success("Texto guardado");
    } else {
      toast.error("Error al guardar el texto");
    }
  };

  return (
    <div className="space-y-6">
      {/* Image */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Imagen de fondo</p>
        {image ? (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image src={image} alt={`Slide ${slideIndex}`} fill className="object-cover" />
            </div>
            <div className="flex flex-wrap gap-2">
              <ImageUploader onUpload={handleImageUpload} label="Cambiar imagen" />
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveImage}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Sin imagen
            </div>
            <ImageUploader onUpload={handleImageUpload} label="Subir imagen" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del slide"
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Características{" "}
          <span className="font-normal text-muted-foreground">(una por línea — tiene prioridad sobre la descripción)</span>
        </label>
        <Textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder={"Agua pura para tu hogar\nServicio técnico 24/7\nEnvíos a todo el país"}
          rows={4}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Descripción{" "}
          <span className="font-normal text-muted-foreground">(se usa si no hay características)</span>
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del slide"
          rows={3}
        />
      </div>

      <Button
        onClick={handleSaveText}
        disabled={saving}
        className="bg-btn-primary text-white hover:bg-btn-primary-hover"
      >
        <Save className="mr-2 h-4 w-4" />
        Guardar texto
      </Button>
    </div>
  );
}
