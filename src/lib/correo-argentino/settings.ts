import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { normalizePostalCode, normalizeProvinceCode } from "@/lib/correo-argentino/mappers";
import type { CorreoArgentinoShippingSettings } from "@/lib/correo-argentino/types";

export const CORREO_ARGENTINO_SETTING_KEYS = {
  customerId: "correo_customer_id",
  senderName: "correo_sender_name",
  senderEmail: "correo_sender_email",
  senderPhone: "correo_sender_phone",
  originStreet: "correo_origin_street",
  originStreetNumber: "correo_origin_street_number",
  originFloor: "correo_origin_floor",
  originApartment: "correo_origin_apartment",
  originCity: "correo_origin_city",
  originProvinceCode: "correo_origin_province_code",
  originPostalCode: "correo_origin_postal_code",
} as const;

const provinciaCodeSchema = z.enum([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]);

export const correoArgentinoSettingsSchema = z.object({
  senderName: z.string().min(2, "Ingresá el nombre del remitente."),
  senderEmail: z.string().email("Ingresá un email válido."),
  senderPhone: z.string().min(6, "Ingresá un teléfono válido."),
  originStreet: z.string().min(2, "Ingresá la calle de origen."),
  originStreetNumber: z.string().min(1, "Ingresá la altura de origen."),
  originFloor: z.string().max(3).optional().or(z.literal("")),
  originApartment: z.string().max(3).optional().or(z.literal("")),
  originCity: z.string().min(2, "Ingresá la ciudad de origen."),
  originProvinceCode: provinciaCodeSchema,
  originPostalCode: z.string().min(3, "Ingresá el código postal de origen."),
});

export type CorreoArgentinoSettingsInput = z.infer<
  typeof correoArgentinoSettingsSchema
>;

export async function getCorreoArgentinoSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: Object.values(CORREO_ARGENTINO_SETTING_KEYS),
      },
    },
  });

  const settingsMap = new Map(settings.map((setting) => [setting.key, setting.value]));

  const customerId = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.customerId)?.trim() ?? "";
  const senderName = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderName)?.trim() ?? "";
  const senderEmail = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderEmail)?.trim() ?? "";
  const senderPhone = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderPhone)?.trim() ?? "";
  const originStreet = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originStreet)?.trim() ?? "";
  const originStreetNumber =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originStreetNumber)?.trim() ?? "";
  const originFloor = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originFloor)?.trim() || null;
  const originApartment =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originApartment)?.trim() || null;
  const originCity = settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originCity)?.trim() ?? "";
  const originProvinceCode =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originProvinceCode)?.trim() ?? "";
  const originPostalCode =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originPostalCode)?.trim() ?? "";

  return {
    customerId,
    senderName,
    senderEmail,
    senderPhone,
    originStreet,
    originStreetNumber,
    originFloor,
    originApartment,
    originCity,
    originProvinceCode,
    originPostalCode,
  };
}

export async function requireCorreoArgentinoShippingSettings() {
  const settings = await getCorreoArgentinoSettings();
  const parsed = correoArgentinoSettingsSchema.safeParse({
    senderName: settings.senderName,
    senderEmail: settings.senderEmail,
    senderPhone: settings.senderPhone,
    originStreet: settings.originStreet,
    originStreetNumber: settings.originStreetNumber,
    originFloor: settings.originFloor ?? "",
    originApartment: settings.originApartment ?? "",
    originCity: settings.originCity,
    originProvinceCode: normalizeProvinceCode(settings.originProvinceCode),
    originPostalCode: normalizePostalCode(settings.originPostalCode),
  });

  if (!settings.customerId) {
    throw new Error("Falta sincronizar el customerId de Correo Argentino.");
  }

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "La configuración de Correo Argentino está incompleta.",
    );
  }

  return {
    customerId: settings.customerId,
    ...parsed.data,
    originFloor: parsed.data.originFloor || null,
    originApartment: parsed.data.originApartment || null,
  } satisfies CorreoArgentinoShippingSettings;
}
