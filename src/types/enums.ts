// Re-export Prisma enums — generated after `prisma generate`
// These mirror the enums in prisma/schema.prisma

export const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const TechnicalServiceUseCase = {
  ACUARISMO: "ACUARISMO",
  CULTIVO_INDOOR: "CULTIVO_INDOOR",
  DOMESTICO: "DOMESTICO",
  COMERCIAL: "COMERCIAL",
  INDUSTRIAL: "INDUSTRIAL",
} as const;

export type TechnicalServiceUseCase =
  (typeof TechnicalServiceUseCase)[keyof typeof TechnicalServiceUseCase];

export const TechnicalServiceStatus = {
  PENDING: "PENDING",
  CONTACTED: "CONTACTED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
} as const;

export type TechnicalServiceStatus =
  (typeof TechnicalServiceStatus)[keyof typeof TechnicalServiceStatus];
