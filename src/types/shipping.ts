export const ShippingCarrier = {
  CORREO_ARGENTINO: "CORREO_ARGENTINO",
} as const;

export type ShippingCarrier =
  (typeof ShippingCarrier)[keyof typeof ShippingCarrier];

export const ShippingDeliveryType = {
  HOME: "D",
  AGENCY: "S",
} as const;

export type ShippingDeliveryType =
  (typeof ShippingDeliveryType)[keyof typeof ShippingDeliveryType];

export const ShippingImportStatus = {
  PENDING: "PENDING",
  IMPORTED: "IMPORTED",
  ERROR: "ERROR",
  SKIPPED: "SKIPPED",
} as const;

export type ShippingImportStatus =
  (typeof ShippingImportStatus)[keyof typeof ShippingImportStatus];

export const SHIPPING_DELIVERY_LABEL: Record<ShippingDeliveryType, string> = {
  D: "Domicilio",
  S: "Sucursal",
};
