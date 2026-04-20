import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import {
  normalizePostalCode,
  normalizeProvinceCode,
} from "@/lib/correo-argentino/mappers";
import {
  decryptSettingValue,
  isEncryptedSettingValue,
} from "@/lib/settings-crypto";
import type { CorreoArgentinoShippingSettings } from "@/lib/correo-argentino/types";

export const CORREO_ARGENTINO_SETTING_KEYS = {
  baseUrl: "correo_base_url",
  apiUser: "correo_api_user",
  apiPassword: "correo_api_password",
  miCorreoEmail: "correo_micorreo_email",
  miCorreoPassword: "correo_micorreo_password",
  customerId: "correo_customer_id",
  defaultDeliveryType: "correo_default_delivery_type",
  defaultProductType: "correo_default_product_type",
  defaultAgency: "correo_default_agency",
  defaultWeight: "correo_default_weight",
  defaultHeight: "correo_default_height",
  defaultLength: "correo_default_length",
  defaultWidth: "correo_default_width",
  defaultProvinceCode: "correo_default_province_code",
  senderName: "correo_sender_name",
  senderEmail: "correo_sender_email",
  senderPhone: "correo_sender_phone",
  senderCellphone: "correo_sender_cellphone",
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

const deliveryTypeSchema = z.enum(["D", "S"]);

export const correoArgentinoSettingsSchema = z.object({
  baseUrl: z.string().url("Ingresá la URL base de Correo Argentino."),
  apiUser: z.string().min(1, "Ingresá el usuario API."),
  apiPassword: z.string().optional().or(z.literal("")),
  miCorreoEmail: z.string().email("Ingresá el email de MiCorreo."),
  miCorreoPassword: z.string().optional().or(z.literal("")),
  defaultDeliveryType: deliveryTypeSchema,
  defaultProductType: z.string().min(1, "Ingresá el tipo de producto."),
  defaultAgency: z.string().optional().or(z.literal("")),
  defaultWeight: z.coerce.number().int().positive("Ingresá un peso mayor a 0."),
  defaultHeight: z.coerce.number().int().positive("Ingresá un alto mayor a 0."),
  defaultLength: z.coerce
    .number()
    .int()
    .positive("Ingresá un largo mayor a 0."),
  defaultWidth: z.coerce.number().int().positive("Ingresá un ancho mayor a 0."),
  defaultProvinceCode: provinciaCodeSchema,
  senderName: z.string().min(2, "Ingresá el nombre del remitente."),
  senderEmail: z.string().email("Ingresá un email válido."),
  senderPhone: z.string().min(6, "Ingresá un teléfono válido."),
  senderCellphone: z.string().optional().or(z.literal("")),
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

type SettingsMap = Map<string, string>;

async function getCorreoArgentinoSettingsMap() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: Object.values(CORREO_ARGENTINO_SETTING_KEYS),
      },
    },
  });

  return new Map(settings.map((setting) => [setting.key, setting.value]));
}

function settingValue(settingsMap: SettingsMap, key: string, fallback = "") {
  return settingsMap.get(key)?.trim() ?? fallback;
}

function encryptedSettingValue(
  settingsMap: SettingsMap,
  key: string,
  fallback = ""
) {
  const value = settingValue(settingsMap, key);

  if (!value) {
    return fallback;
  }

  return isEncryptedSettingValue(value) ? decryptSettingValue(value) : value;
}

export async function getCorreoArgentinoSettings() {
  const settingsMap = await getCorreoArgentinoSettingsMap();

  const customerId =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.customerId)?.trim() ?? "";
  const apiPassword =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.apiPassword)?.trim() ?? "";
  const miCorreoPassword =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.miCorreoPassword)?.trim() ??
    "";
  const baseUrl =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.baseUrl)?.trim() ??
    process.env.CORREO_ARGENTINO_BASE_URL ??
    "";
  const apiUser =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.apiUser)?.trim() ??
    process.env.CORREO_ARGENTINO_API_USER ??
    "";
  const miCorreoEmail =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.miCorreoEmail)?.trim() ??
    process.env.CORREO_ARGENTINO_MICORREO_EMAIL ??
    "";
  const defaultDeliveryType =
    settingsMap
      .get(CORREO_ARGENTINO_SETTING_KEYS.defaultDeliveryType)
      ?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_DELIVERY_TYPE ??
    "D";
  const defaultProductType =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultProductType)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_PRODUCT_TYPE ??
    "CP";
  const defaultAgency =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultAgency)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_AGENCY ??
    "";
  const defaultWeight =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultWeight)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_WEIGHT ??
    "1000";
  const defaultHeight =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultHeight)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_HEIGHT ??
    "20";
  const defaultLength =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultLength)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_LENGTH ??
    "30";
  const defaultWidth =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.defaultWidth)?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_WIDTH ??
    "20";
  const defaultProvinceCode =
    settingsMap
      .get(CORREO_ARGENTINO_SETTING_KEYS.defaultProvinceCode)
      ?.trim() ??
    process.env.CORREO_ARGENTINO_DEFAULT_PROVINCE_CODE ??
    "B";
  const senderName =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderName)?.trim() ?? "";
  const senderEmail =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderEmail)?.trim() ?? "";
  const senderPhone =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderPhone)?.trim() ?? "";
  const senderCellphone =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.senderCellphone)?.trim() ??
    "";
  const originStreet =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originStreet)?.trim() ?? "";
  const originStreetNumber =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originStreetNumber)?.trim() ??
    "";
  const originFloor =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originFloor)?.trim() || null;
  const originApartment =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originApartment)?.trim() ||
    null;
  const originCity =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originCity)?.trim() ?? "";
  const originProvinceCode =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originProvinceCode)?.trim() ??
    "";
  const originPostalCode =
    settingsMap.get(CORREO_ARGENTINO_SETTING_KEYS.originPostalCode)?.trim() ??
    "";

  return {
    baseUrl,
    apiUser,
    apiPasswordConfigured: Boolean(
      apiPassword || process.env.CORREO_ARGENTINO_API_PASSWORD
    ),
    miCorreoEmail,
    miCorreoPasswordConfigured: Boolean(
      miCorreoPassword || process.env.CORREO_ARGENTINO_MICORREO_PASSWORD
    ),
    customerId,
    defaultDeliveryType,
    defaultProductType,
    defaultAgency,
    defaultWeight,
    defaultHeight,
    defaultLength,
    defaultWidth,
    defaultProvinceCode,
    senderName,
    senderEmail,
    senderPhone,
    senderCellphone,
    originStreet,
    originStreetNumber,
    originFloor,
    originApartment,
    originCity,
    originProvinceCode,
    originPostalCode,
  };
}

export async function getCorreoArgentinoRuntimeSettings() {
  const settingsMap = await getCorreoArgentinoSettingsMap();

  return {
    baseUrl: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.baseUrl,
      process.env.CORREO_ARGENTINO_BASE_URL ?? ""
    ).replace(/\/+$/, ""),
    apiUser: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.apiUser,
      process.env.CORREO_ARGENTINO_API_USER ?? ""
    ),
    apiPassword: encryptedSettingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.apiPassword,
      process.env.CORREO_ARGENTINO_API_PASSWORD ?? ""
    ),
    miCorreoEmail: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.miCorreoEmail,
      process.env.CORREO_ARGENTINO_MICORREO_EMAIL ?? ""
    ),
    miCorreoPassword: encryptedSettingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.miCorreoPassword,
      process.env.CORREO_ARGENTINO_MICORREO_PASSWORD ?? ""
    ),
    defaultDeliveryType: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.defaultDeliveryType,
      process.env.CORREO_ARGENTINO_DEFAULT_DELIVERY_TYPE ?? "D"
    ),
    defaultProductType: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.defaultProductType,
      process.env.CORREO_ARGENTINO_DEFAULT_PRODUCT_TYPE ?? "CP"
    ),
    defaultAgency: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.defaultAgency,
      process.env.CORREO_ARGENTINO_DEFAULT_AGENCY ?? ""
    ),
    defaultWeight: Number(
      settingValue(
        settingsMap,
        CORREO_ARGENTINO_SETTING_KEYS.defaultWeight,
        process.env.CORREO_ARGENTINO_DEFAULT_WEIGHT ?? "1000"
      )
    ),
    defaultHeight: Number(
      settingValue(
        settingsMap,
        CORREO_ARGENTINO_SETTING_KEYS.defaultHeight,
        process.env.CORREO_ARGENTINO_DEFAULT_HEIGHT ?? "20"
      )
    ),
    defaultLength: Number(
      settingValue(
        settingsMap,
        CORREO_ARGENTINO_SETTING_KEYS.defaultLength,
        process.env.CORREO_ARGENTINO_DEFAULT_LENGTH ?? "30"
      )
    ),
    defaultWidth: Number(
      settingValue(
        settingsMap,
        CORREO_ARGENTINO_SETTING_KEYS.defaultWidth,
        process.env.CORREO_ARGENTINO_DEFAULT_WIDTH ?? "20"
      )
    ),
    defaultProvinceCode: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.defaultProvinceCode,
      process.env.CORREO_ARGENTINO_DEFAULT_PROVINCE_CODE ?? "B"
    ),
    senderName: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.senderName,
      process.env.CORREO_ARGENTINO_SENDER_NAME ?? ""
    ),
    senderEmail: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.senderEmail,
      process.env.CORREO_ARGENTINO_SENDER_EMAIL ?? ""
    ),
    senderPhone: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.senderPhone,
      process.env.CORREO_ARGENTINO_SENDER_PHONE ?? ""
    ),
    senderCellphone: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.senderCellphone,
      process.env.CORREO_ARGENTINO_SENDER_CELLPHONE ?? ""
    ),
    originStreet: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originStreet,
      process.env.CORREO_ARGENTINO_ORIGIN_STREET ?? ""
    ),
    originStreetNumber: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originStreetNumber,
      process.env.CORREO_ARGENTINO_ORIGIN_STREET_NUMBER ?? ""
    ),
    originFloor: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originFloor,
      process.env.CORREO_ARGENTINO_ORIGIN_FLOOR ?? ""
    ),
    originApartment: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originApartment,
      process.env.CORREO_ARGENTINO_ORIGIN_APARTMENT ?? ""
    ),
    originCity: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originCity,
      process.env.CORREO_ARGENTINO_ORIGIN_CITY ?? ""
    ),
    originProvinceCode: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originProvinceCode,
      process.env.CORREO_ARGENTINO_ORIGIN_PROVINCE_CODE ?? "B"
    ),
    originPostalCode: settingValue(
      settingsMap,
      CORREO_ARGENTINO_SETTING_KEYS.originPostalCode,
      process.env.CORREO_ARGENTINO_ORIGIN_POSTAL_CODE ?? ""
    ),
  };
}

export async function requireCorreoArgentinoShippingSettings() {
  const settings = await getCorreoArgentinoSettings();
  const parsed = correoArgentinoSettingsSchema.safeParse({
    baseUrl: settings.baseUrl,
    apiUser: settings.apiUser,
    apiPassword: "configured",
    miCorreoEmail: settings.miCorreoEmail,
    miCorreoPassword: "configured",
    defaultDeliveryType: settings.defaultDeliveryType,
    defaultProductType: settings.defaultProductType,
    defaultAgency: settings.defaultAgency,
    defaultWeight: settings.defaultWeight,
    defaultHeight: settings.defaultHeight,
    defaultLength: settings.defaultLength,
    defaultWidth: settings.defaultWidth,
    defaultProvinceCode: normalizeProvinceCode(settings.defaultProvinceCode),
    senderName: settings.senderName,
    senderEmail: settings.senderEmail,
    senderPhone: settings.senderPhone,
    senderCellphone: settings.senderCellphone,
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
        "La configuración de Correo Argentino está incompleta."
    );
  }

  return {
    customerId: settings.customerId,
    senderName: parsed.data.senderName,
    senderEmail: parsed.data.senderEmail,
    senderPhone: parsed.data.senderPhone,
    senderCellphone: parsed.data.senderCellphone || null,
    originStreet: parsed.data.originStreet,
    originStreetNumber: parsed.data.originStreetNumber,
    originFloor: parsed.data.originFloor || null,
    originApartment: parsed.data.originApartment || null,
    originCity: parsed.data.originCity,
    originProvinceCode: parsed.data.originProvinceCode,
    originPostalCode: parsed.data.originPostalCode,
  } satisfies CorreoArgentinoShippingSettings;
}
