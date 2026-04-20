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
  baseUrl: string;
  apiUser: string;
  apiPassword: string;
  miCorreoEmail: string;
  miCorreoPassword: string;
  defaultDeliveryType: string;
  defaultProductType: string;
  defaultAgency: string;
  defaultWeight: string;
  defaultHeight: string;
  defaultLength: string;
  defaultWidth: string;
  defaultProvinceCode: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCellphone: string;
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
  apiPasswordConfigured: boolean;
  miCorreoPasswordConfigured: boolean;
  defaultValues: CorreoArgentinoSettingsFormValues;
}

export function CorreoArgentinoSettingsCard({
  customerId,
  apiPasswordConfigured,
  miCorreoPasswordConfigured,
  defaultValues,
}: CorreoArgentinoSettingsCardProps) {
  const [formValues, setFormValues] = useState(defaultValues);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerId);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleChange = (
    key: keyof CorreoArgentinoSettingsFormValues,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertCorreoArgentinoSettings({
      ...formValues,
      originProvinceCode: formValues.originProvinceCode.toUpperCase(),
      originPostalCode: formValues.originPostalCode.toUpperCase(),
      defaultProvinceCode: formValues.defaultProvinceCode.toUpperCase(),
      defaultWeight: Number(formValues.defaultWeight),
      defaultHeight: Number(formValues.defaultHeight),
      defaultLength: Number(formValues.defaultLength),
      defaultWidth: Number(formValues.defaultWidth),
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
        <p className="text-text-primary text-sm font-medium">
          customerId actual
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
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

      <div className="space-y-4">
        <div>
          <h3 className="text-text-primary text-base font-semibold">
            Credenciales
          </h3>
          <p className="text-muted-foreground text-sm">
            Las contraseñas se guardan cifradas y no se muestran después de
            guardar.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL base API</label>
            <Input
              value={formValues.baseUrl}
              onChange={(e) => handleChange("baseUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario API</label>
            <Input
              value={formValues.apiUser}
              onChange={(e) => handleChange("apiUser", e.target.value)}
              placeholder="Usuario API"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password API</label>
            <Input
              type="password"
              value={formValues.apiPassword}
              onChange={(e) => handleChange("apiPassword", e.target.value)}
              placeholder={
                apiPasswordConfigured ? "Configurado" : "Password API"
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email MiCorreo</label>
            <Input
              type="email"
              value={formValues.miCorreoEmail}
              onChange={(e) => handleChange("miCorreoEmail", e.target.value)}
              placeholder="cuenta@micorreo.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password MiCorreo</label>
            <Input
              type="password"
              value={formValues.miCorreoPassword}
              onChange={(e) => handleChange("miCorreoPassword", e.target.value)}
              placeholder={
                miCorreoPasswordConfigured ? "Configurado" : "Password MiCorreo"
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-text-primary text-base font-semibold">
          Defaults de envío
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo entrega</label>
            <Input
              value={formValues.defaultDeliveryType}
              onChange={(e) =>
                handleChange(
                  "defaultDeliveryType",
                  e.target.value.toUpperCase()
                )
              }
              placeholder="D"
              maxLength={1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo producto</label>
            <Input
              value={formValues.defaultProductType}
              onChange={(e) =>
                handleChange("defaultProductType", e.target.value.toUpperCase())
              }
              placeholder="CP"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sucursal default</label>
            <Input
              value={formValues.defaultAgency}
              onChange={(e) => handleChange("defaultAgency", e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Provincia default</label>
            <Input
              value={formValues.defaultProvinceCode}
              onChange={(e) =>
                handleChange(
                  "defaultProvinceCode",
                  e.target.value.toUpperCase()
                )
              }
              placeholder="B"
              maxLength={1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Peso default (g)</label>
            <Input
              type="number"
              min="1"
              value={formValues.defaultWeight}
              onChange={(e) => handleChange("defaultWeight", e.target.value)}
              placeholder="1000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Alto default (cm)</label>
            <Input
              type="number"
              min="1"
              value={formValues.defaultHeight}
              onChange={(e) => handleChange("defaultHeight", e.target.value)}
              placeholder="20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Largo default (cm)</label>
            <Input
              type="number"
              min="1"
              value={formValues.defaultLength}
              onChange={(e) => handleChange("defaultLength", e.target.value)}
              placeholder="30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ancho default (cm)</label>
            <Input
              type="number"
              min="1"
              value={formValues.defaultWidth}
              onChange={(e) => handleChange("defaultWidth", e.target.value)}
              placeholder="20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-text-primary text-base font-semibold">
          Remitente y origen
        </h3>
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
            <label className="text-sm font-medium">Celular remitente</label>
            <Input
              value={formValues.senderCellphone}
              onChange={(e) => handleChange("senderCellphone", e.target.value)}
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
              onChange={(e) =>
                handleChange("originStreetNumber", e.target.value)
              }
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
              onChange={(e) =>
                handleChange("originProvinceCode", e.target.value.toUpperCase())
              }
              placeholder="C"
              maxLength={1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Código postal origen</label>
            <Input
              value={formValues.originPostalCode}
              onChange={(e) =>
                handleChange("originPostalCode", e.target.value.toUpperCase())
              }
              placeholder="1001"
            />
          </div>
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
