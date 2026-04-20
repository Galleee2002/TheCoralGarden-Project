import type { Order, Product } from "@prisma/client";
import {
  CorreoArgentinoImportRequest,
  CorreoArgentinoQuotePayload,
  CorreoArgentinoQuoteResult,
  CorreoArgentinoRate,
  CorreoArgentinoRateRequest,
  CorreoArgentinoRateResponse,
  CorreoArgentinoShippingSettings,
} from "@/lib/correo-argentino/types";

type ProductWithShippingDimensions = Pick<
  Product,
  | "id"
  | "name"
  | "shippingWeightGrams"
  | "shippingHeightCm"
  | "shippingWidthCm"
  | "shippingLengthCm"
>;

type OrderWithRecipientFields = Pick<
  Order,
  | "id"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "customerStreet"
  | "customerCity"
  | "customerProvince"
  | "customerZip"
  | "subtotal"
>;

export type QuoteCartItem = {
  productId: string;
  quantity: number;
};

export function normalizePostalCode(postalCode: string) {
  return postalCode.trim().toUpperCase();
}

export function normalizeProvinceCode(provinceCode: string) {
  return provinceCode.trim().toUpperCase();
}

const PROVINCE_NAME_TO_CODE: Record<string, string> = {
  salta: "A",
  "provincia de buenos aires": "B",
  "buenos aires": "B",
  "ciudad autonoma de buenos aires": "C",
  "ciudad autónoma de buenos aires": "C",
  caba: "C",
  "capital federal": "C",
  "san luis": "D",
  "entre rios": "E",
  "entre ríos": "E",
  "la rioja": "F",
  "santiago del estero": "G",
  chaco: "H",
  "san juan": "J",
  catamarca: "K",
  "la pampa": "L",
  mendoza: "M",
  misiones: "N",
  formosa: "P",
  neuquen: "Q",
  neuquén: "Q",
  "rio negro": "R",
  "río negro": "R",
  "santa fe": "S",
  tucuman: "T",
  tucumán: "T",
  chubut: "U",
  "tierra del fuego": "V",
  corrientes: "W",
  cordoba: "X",
  córdoba: "X",
  jujuy: "Y",
  "santa cruz": "Z",
};

export function resolveProvinceCode(value: string) {
  const normalized = value.trim().toLowerCase();
  const directCode = normalizeProvinceCode(value);

  if (/^[A-Z]$/.test(directCode)) {
    return directCode;
  }

  const code = PROVINCE_NAME_TO_CODE[normalized];

  if (!code) {
    throw new Error(
      `No se pudo convertir la provincia "${value}" al código requerido por Correo Argentino.`
    );
  }

  return code;
}

function splitStreetAddress(addressLine: string) {
  const trimmed = addressLine.trim();
  const match = trimmed.match(/^(.*?)(?:\s+(\d+[A-Za-z0-9/-]*))$/);

  if (!match) {
    return {
      streetName: trimmed,
      streetNumber: "S/N",
    };
  }

  return {
    streetName: match[1].trim(),
    streetNumber: match[2].trim(),
  };
}

export function buildRateRequest(params: {
  customerId: string;
  postalCodeOrigin: string;
  postalCodeDestination: string;
  products: ProductWithShippingDimensions[];
  items: QuoteCartItem[];
}) {
  const productMap = new Map(
    params.products.map((product) => [product.id, product])
  );

  const dimensions = params.items.reduce(
    (acc, item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(
          "Uno o más productos no están disponibles para cotizar."
        );
      }

      if (
        product.shippingWeightGrams <= 0 ||
        product.shippingHeightCm <= 0 ||
        product.shippingWidthCm <= 0 ||
        product.shippingLengthCm <= 0
      ) {
        throw new Error(
          `El producto "${product.name}" no tiene peso y dimensiones de envío configurados.`
        );
      }

      acc.weight += product.shippingWeightGrams * item.quantity;
      acc.height += product.shippingHeightCm * item.quantity;
      acc.width = Math.max(acc.width, product.shippingWidthCm);
      acc.length = Math.max(acc.length, product.shippingLengthCm);

      return acc;
    },
    { weight: 0, height: 0, width: 0, length: 0 }
  );

  return {
    customerId: params.customerId,
    postalCodeOrigin: normalizePostalCode(params.postalCodeOrigin),
    postalCodeDestination: normalizePostalCode(params.postalCodeDestination),
    deliveredType: "D",
    dimensions,
  } satisfies CorreoArgentinoRateRequest;
}

export function selectBestRate(rates: CorreoArgentinoRate[]) {
  const homeRates = rates.filter((rate) => rate.deliveredType === "D");

  if (homeRates.length === 0) {
    throw new Error(
      "Correo Argentino no devolvió tarifas válidas para envío a domicilio."
    );
  }

  return [...homeRates].sort((a, b) => {
    if (a.price !== b.price) {
      return a.price - b.price;
    }

    return Number(a.deliveryTimeMax) - Number(b.deliveryTimeMax);
  })[0];
}

export function buildQuotePayload(params: {
  request: CorreoArgentinoRateRequest;
  response: CorreoArgentinoRateResponse;
  selectedRate: CorreoArgentinoRate;
}) {
  return {
    request: params.request as unknown as Record<string, unknown>,
    response: params.response as unknown as Record<string, unknown>,
    selectedRate: params.selectedRate as unknown as Record<string, unknown>,
  } as CorreoArgentinoQuotePayload;
}

export function mapRateToQuoteResult(params: {
  selectedRate: CorreoArgentinoRate;
  validTo: string;
}) {
  const { selectedRate, validTo } = params;

  return {
    price: selectedRate.price,
    productType: selectedRate.productType,
    productName: selectedRate.productName,
    deliveryTimeMin: selectedRate.deliveryTimeMin,
    deliveryTimeMax: selectedRate.deliveryTimeMax,
    validTo,
  } satisfies CorreoArgentinoQuoteResult;
}

export function buildImportRequest(params: {
  order: OrderWithRecipientFields;
  quotePayload: CorreoArgentinoQuotePayload;
  settings: CorreoArgentinoShippingSettings;
}) {
  const request = params.quotePayload
    .request as unknown as CorreoArgentinoRateRequest;
  const selectedRate = params.quotePayload
    .selectedRate as unknown as CorreoArgentinoQuoteResult;
  const destinationAddress = splitStreetAddress(params.order.customerStreet);

  return {
    customerId: params.settings.customerId,
    extOrderId: params.order.id,
    orderNumber: params.order.id,
    sender: {
      name: params.settings.senderName,
      phone: params.settings.senderPhone,
      cellPhone: params.settings.senderCellphone || params.settings.senderPhone,
      email: params.settings.senderEmail,
      originAddress: {
        streetName: params.settings.originStreet,
        streetNumber: params.settings.originStreetNumber,
        floor: params.settings.originFloor,
        apartment: params.settings.originApartment,
        city: params.settings.originCity,
        provinceCode: normalizeProvinceCode(params.settings.originProvinceCode),
        postalCode: normalizePostalCode(params.settings.originPostalCode),
      },
    },
    recipient: {
      name: params.order.customerName,
      phone: params.order.customerPhone || null,
      cellPhone: params.order.customerPhone || null,
      email: params.order.customerEmail,
    },
    shipping: {
      deliveryType: "D",
      agency: null,
      address: {
        streetName: destinationAddress.streetName,
        streetNumber: destinationAddress.streetNumber,
        floor: null,
        apartment: null,
        city: params.order.customerCity,
        provinceCode: resolveProvinceCode(params.order.customerProvince),
        postalCode: normalizePostalCode(params.order.customerZip),
      },
      productType: selectedRate.productType,
      weight: request.dimensions.weight,
      declaredValue: Number(params.order.subtotal),
      height: request.dimensions.height,
      length: request.dimensions.length,
      width: request.dimensions.width,
    },
  } satisfies CorreoArgentinoImportRequest;
}
