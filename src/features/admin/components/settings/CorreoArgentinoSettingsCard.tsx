"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  syncCorreoArgentinoCustomerId,
  upsertCorreoArgentinoSettings,
} from "@/features/admin/actions/correoArgentinoActions";
import type { CorreoArgentinoSettingsInput } from "@/lib/correo-argentino/settings";

type CorreoArgentinoSettingsFormValues = {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  originStreet: string;
  originStreetNumber: string;
  originFloor: string;
  originApartment: string;
  originCity: string;
  originProvinceCode: string;
  originPostalCode: string;
};

interface CorreoArgentinoSettingsCardProps {
  customerId: string;
  defaultValues: CorreoArgentinoSettingsFormValues;
}

export function CorreoArgentinoSettingsCard({
  customerId,
  defaultValues,
}: CorreoArgentinoSettingsCardProps) {
  const [formValues, setFormValues] = useState(defaultValues);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerId);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleChange = (
    key: keyof CorreoArgentinoSettingsFormValues,
    value: string,
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertCorreoArgentinoSettings({
      ...formValues,
      originProvinceCode: formValues.originProvinceCode.toUpperCase(),
      originPostalCode: formValues.originPostalCode.toUpperCase(),
    } as CorreoArgentinoSettingsInput);
    setSaving(false);

    if (result?.data) {
      toast.success("Configuración de Correo Argentino guardada.");
      return;
    }

    toast.error(result?.serverError ?? "No se pudo guardar la configuración.");
  };

  const handleSyncCustomerId = async () => {
    setSyncing(true);
    const result = await syncCorreoArgentinoCustomerId({});
    setSyncing(false);

    if (result?.data?.customerId) {
      setCurrentCustomerId(result.data.customerId);
      toast.success("customerId sincronizado correctamente.");
      return;
    }

    toast.error(result?.serverError ?? "No se pudo sincronizar el customerId.");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-dropdown bg-card-light p-4">
        <p className="text-sm font-medium text-text-primary">customerId actual</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentCustomerId || "Todavía no sincronizado"}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleSyncCustomerId}
          disabled={syncing}
          className="mt-3"
        >
          {syncing && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />}
          {!syncing && <RefreshCcw className="mr-2 h-4 w-4" />}
          Sincronizar customerId
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre remitente</label>
          <Input
            value={formValues.senderName}
            onChange={(e) => handleChange("senderName", e.target.value)}
            placeholder="The Coral Garden"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email remitente</label>
          <Input
            type="email"
            value={formValues.senderEmail}
            onChange={(e) => handleChange("senderEmail", e.target.value)}
            placeholder="logistica@dominio.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Teléfono remitente</label>
          <Input
            value={formValues.senderPhone}
            onChange={(e) => handleChange("senderPhone", e.target.value)}
            placeholder="+54 9 ..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Calle de origen</label>
          <Input
            value={formValues.originStreet}
            onChange={(e) => handleChange("originStreet", e.target.value)}
            placeholder="Av. Siempre Viva"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Número de origen</label>
          <Input
            value={formValues.originStreetNumber}
            onChange={(e) => handleChange("originStreetNumber", e.target.value)}
            placeholder="123"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Piso</label>
          <Input
            value={formValues.originFloor ?? ""}
            onChange={(e) => handleChange("originFloor", e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Departamento</label>
          <Input
            value={formValues.originApartment ?? ""}
            onChange={(e) => handleChange("originApartment", e.target.value)}
            placeholder="A"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad</label>
          <Input
            value={formValues.originCity}
            onChange={(e) => handleChange("originCity", e.target.value)}
            placeholder="Buenos Aires"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Código provincia</label>
          <Input
            value={formValues.originProvinceCode}
            onChange={(e) => handleChange("originProvinceCode", e.target.value.toUpperCase())}
            placeholder="C"
            maxLength={1}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Código postal origen</label>
          <Input
            value={formValues.originPostalCode}
            onChange={(e) => handleChange("originPostalCode", e.target.value.toUpperCase())}
            placeholder="1001"
          />
        </div>
      </div>

      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving && <Save className="mr-2 h-4 w-4 animate-pulse" />}
        {!saving && <Save className="mr-2 h-4 w-4" />}
        Guardar configuración
      </Button>
    </div>
  );
}
