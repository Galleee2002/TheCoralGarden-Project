"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { upsertSetting } from "@/features/admin/actions/settingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface HeroBannerFormProps {
  currentUrl: string | null;
}

export function HeroBannerForm({ currentUrl }: HeroBannerFormProps) {
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (newUrl: string) => {
    setUrl(newUrl);
    setSaving(true);
    const result = await upsertSetting({ key: "hero_banner_url", value: newUrl });
    setSaving(false);
    if (result?.data) {
      toast.success("Banner actualizado");
    } else {
      toast.error("Error al guardar el banner");
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    const result = await upsertSetting({ key: "hero_banner_url", value: "" });
    setSaving(false);
    if (result?.data) {
      setUrl(null);
      toast.success("Banner eliminado");
    } else {
      toast.error("Error al eliminar el banner");
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-3">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border">
            <Image src={url} alt="Hero banner" fill className="object-cover" />
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
              Eliminar banner
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Sin imagen — se mostrará el degradado por defecto
          </div>
          <ImageUploader onUpload={handleUpload} label="Subir imagen de banner" />
        </div>
      )}
      {saving && <p className="text-sm text-muted-foreground">Guardando...</p>}
    </div>
  );
}
