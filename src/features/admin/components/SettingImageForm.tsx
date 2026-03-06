"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { upsertSetting } from "@/features/admin/actions/settingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface SettingImageFormProps {
  settingKey: string;
  currentUrl: string | null;
  label: string;
  aspectClass?: string;
}

export function SettingImageForm({
  settingKey,
  currentUrl,
  label,
  aspectClass = "aspect-video",
}: SettingImageFormProps) {
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (newUrl: string) => {
    setUrl(newUrl);
    setSaving(true);
    const result = await upsertSetting({ key: settingKey, value: newUrl });
    setSaving(false);
    if (result?.data) {
      toast.success("Imagen actualizada");
    } else {
      toast.error("Error al guardar la imagen");
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    const result = await upsertSetting({ key: settingKey, value: "" });
    setSaving(false);
    if (result?.data) {
      setUrl(null);
      toast.success("Imagen eliminada");
    } else {
      toast.error("Error al eliminar la imagen");
    }
  };

  return (
    <div className="space-y-3">
      {url ? (
        <>
          <div className={`relative w-full overflow-hidden rounded-lg border ${aspectClass}`}>
            <Image src={url} alt={label} fill className="object-cover" />
          </div>
          <div className="flex gap-3">
            <ImageUploader onUpload={handleUpload} label="Cambiar imagen" />
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <div
            className={`flex w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground ${aspectClass}`}
          >
            Sin imagen
          </div>
          <ImageUploader onUpload={handleUpload} label={`Subir ${label}`} />
        </div>
      )}
      {saving && <p className="text-sm text-muted-foreground">Guardando...</p>}
    </div>
  );
}
