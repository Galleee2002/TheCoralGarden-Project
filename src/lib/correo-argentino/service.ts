import type { Order } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getRates, importShipping, validateUser } from "@/lib/correo-argentino/client";
import {
  buildImportRequest,
  buildQuotePayload,
  buildRateRequest,
  mapRateToQuoteResult,
  QuoteCartItem,
  selectBestRate,
} from "@/lib/correo-argentino/mappers";
import { requireCorreoArgentinoShippingSettings } from "@/lib/correo-argentino/settings";
import type {
  CorreoArgentinoImportResult,
  CorreoArgentinoQuotePayload,
  CorreoArgentinoQuoteResult,
} from "@/lib/correo-argentino/types";

export async function quoteShippingForItems(params: {
  customerZip: string;
  items: QuoteCartItem[];
}) {
  if (params.items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const settings = await requireCorreoArgentinoShippingSettings();
  const products = await prisma.product.findMany({
    where: {
      id: { in: [...new Set(params.items.map((item) => item.productId))] },
      active: true,
    },
    select: {
      id: true,
      name: true,
      shippingWeightGrams: true,
      shippingHeightCm: true,
      shippingWidthCm: true,
      shippingLengthCm: true,
    },
  });

  if (products.length !== new Set(params.items.map((item) => item.productId)).size) {
    throw new Error("Uno o más productos ya no están disponibles.");
  }

  const rateRequest = buildRateRequest({
    customerId: settings.customerId,
    postalCodeOrigin: settings.originPostalCode,
    postalCodeDestination: params.customerZip,
    products,
    items: params.items,
  });

  const rateResponse = await getRates(rateRequest);
  const selectedRate = selectBestRate(rateResponse.rates);

  return {
    quote: mapRateToQuoteResult({
      selectedRate,
      validTo: rateResponse.validTo,
    }),
    payload: buildQuotePayload({
      request: rateRequest,
      response: rateResponse,
      selectedRate,
    }),
  };
}

export async function importOrderShipping(params: {
  order: Pick<
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
    | "shippingRatePayload"
  >;
}): Promise<CorreoArgentinoImportResult> {
  if (!params.order.shippingRatePayload) {
    return {
      status: "FAILED",
      errorMessage: "La orden no tiene una cotización de Correo Argentino asociada.",
    } satisfies CorreoArgentinoImportResult;
  }

  try {
    const settings = await requireCorreoArgentinoShippingSettings();
    const importRequest = buildImportRequest({
      order: params.order,
      quotePayload: params.order.shippingRatePayload as CorreoArgentinoQuotePayload,
      settings,
    });
    const rawResponse = await importShipping(importRequest);

    return {
      status: "IMPORTED",
      externalId: params.order.id,
      rawResponse,
    } satisfies CorreoArgentinoImportResult;
  } catch (error) {
    return {
      status: "FAILED",
      errorMessage: error instanceof Error ? error.message : "Error al importar el envío.",
    } satisfies CorreoArgentinoImportResult;
  }
}

export async function resolveCorreoArgentinoCustomerId() {
  const email = process.env.CORREO_ARGENTINO_MICORREO_EMAIL;
  const password = process.env.CORREO_ARGENTINO_MICORREO_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan las variables CORREO_ARGENTINO_MICORREO_EMAIL y/o CORREO_ARGENTINO_MICORREO_PASSWORD.",
    );
  }

  const response = await validateUser({ email, password });

  return response.customerId;
}

export type { CorreoArgentinoQuoteResult };
