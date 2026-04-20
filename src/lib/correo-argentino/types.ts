import type { Prisma } from "@prisma/client";

export interface CorreoArgentinoTokenResponse {
  token: string;
  expires: string;
}

export interface CorreoArgentinoValidateUserRequest {
  email: string;
  password: string;
}

export interface CorreoArgentinoValidateUserResponse {
  customerId: string;
  createdAt: string;
}

export interface CorreoArgentinoDimensions {
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface CorreoArgentinoRateRequest {
  customerId: string;
  postalCodeOrigin: string;
  postalCodeDestination: string;
  deliveredType?: "D";
  dimensions: CorreoArgentinoDimensions;
}

export interface CorreoArgentinoRate {
  deliveredType: "D" | "S";
  productType: string;
  productName: string;
  price: number;
  deliveryTimeMin: string;
  deliveryTimeMax: string;
}

export interface CorreoArgentinoRateResponse {
  customerId: string;
  validTo: string;
  rates: CorreoArgentinoRate[];
}

export interface CorreoArgentinoQuoteResult {
  price: number;
  productType: string;
  productName: string;
  deliveryTimeMin: string;
  deliveryTimeMax: string;
  validTo: string;
}

export interface CorreoArgentinoAddress {
  streetName: string | null;
  streetNumber: string | null;
  floor: string | null;
  apartment: string | null;
  city: string | null;
  provinceCode: string | null;
  postalCode: string | null;
}

export interface CorreoArgentinoImportRequest {
  customerId: string;
  extOrderId: string;
  orderNumber: string;
  sender: {
    name: string | null;
    phone: string | null;
    cellPhone: string | null;
    email: string | null;
    originAddress: CorreoArgentinoAddress;
  };
  recipient: {
    name: string;
    phone: string | null;
    cellPhone: string | null;
    email: string;
  };
  shipping: {
    deliveryType: "D";
    agency: null;
    address: CorreoArgentinoAddress;
    productType: string;
    weight: number;
    declaredValue: number;
    height: number;
    length: number;
    width: number;
  };
}

export interface CorreoArgentinoImportResult {
  status: "IMPORTED" | "FAILED";
  trackingNumber?: string;
  externalId?: string;
  rawResponse?: unknown;
  errorMessage?: string;
}

export interface CorreoArgentinoShippingSettings {
  customerId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCellphone: string | null;
  originStreet: string;
  originStreetNumber: string;
  originFloor: string | null;
  originApartment: string | null;
  originCity: string;
  originProvinceCode: string;
  originPostalCode: string;
}

export interface CorreoArgentinoQuotePayload extends Prisma.JsonObject {
  request: Prisma.JsonObject;
  selectedRate: Prisma.JsonObject;
  response: Prisma.JsonObject;
}
