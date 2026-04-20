"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { upsertSetting } from "@/features/admin/actions/settingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ImageIcon, Save, Type, X } from "lucide-react";

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
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <section className="space-y-4 rounded-button border border-border/50 bg-bg-primary p-4">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <ImageIcon className="h-4 w-4 text-text-secondary" />
            Vista previa
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            La imagen se actualiza por separado para que el cambio sea inmediato.
          </p>
        </div>

        {image ? (
          <>
            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-button border border-border/60 bg-card">
              <Image src={image} alt={`Slide ${slideIndex}`} fill className="object-cover" />
            </div>
            <div className="grid gap-2">
              <ImageUploader onUpload={handleImageUpload} label="Cambiar imagen" />
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveImage}
                disabled={saving}
                className="justify-center"
              >
                <X className="h-4 w-4" />
                Eliminar imagen
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex aspect-[5/3] w-full items-center justify-center rounded-button border border-dashed border-border bg-card px-4 text-center text-sm text-muted-foreground">
              Sin imagen cargada
            </div>
            <ImageUploader onUpload={handleImageUpload} label="Subir imagen" />
          </div>
        )}
      </section>

      <section className="space-y-5 rounded-button border border-border/50 bg-bg-primary p-4">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Type className="h-4 w-4 text-text-secondary" />
            Contenido del slide
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Completá el título y elegí una sola capa de apoyo: lista de características o
            descripción breve.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del slide"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Características
            </label>
            <p className="text-xs leading-5 text-muted-foreground">
              Una por línea. Si completás este campo, se usa en lugar de la descripción.
            </p>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={"Agua pura para tu hogar\nServicio técnico 24/7\nEnvíos a todo el país"}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Descripción</label>
            <p className="text-xs leading-5 text-muted-foreground">
              Usala solo si no querés mostrar características.
            </p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del slide"
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
          <Button
            onClick={handleSaveText}
            disabled={saving}
            className="bg-btn-primary text-white hover:bg-btn-primary-hover"
          >
            <Save className="h-4 w-4" />
            Guardar contenido
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            La imagen se guarda al subirla. El texto se guarda con este botón.
          </p>
        </div>
      </section>
    </div>
  );
}
