type CorreoDeliveryType = "D" | "S";

export type CorreoShippingRate = {
  deliveredType: CorreoDeliveryType;
  productType: string;
  productName: string;
  price: number;
  deliveryTimeMin: string | null;
  deliveryTimeMax: string | null;
  validTo: string | null;
};

export type CorreoAgency = {
  code: string;
  name: string;
  status: string | null;
  address: string | null;
  city: string | null;
  provinceCode: string | null;
  postalCode: string | null;
};

type CorreoAuth = {
  token: string;
  customerId: string;
};

type CorreoDimensions = {
  weight: number;
  height: number;
  width: number;
  length: number;
};

type CorreoImportShipmentRequest = {
  customerId: string;
  extOrderId: string;
  orderNumber: string;
  sender?: {
    name?: string | null;
    phone?: string | null;
    cellPhone?: string | null;
    email?: string | null;
    originAddress?: {
      streetName?: string | null;
      streetNumber?: string | null;
      floor?: string | null;
      apartment?: string | null;
      city?: string | null;
      provinceCode?: string | null;
      postalCode?: string | null;
    };
  };
  recipient: {
    name: string;
    phone?: string;
    cellPhone?: string;
    email: string;
  };
  shipping: {
    deliveryType: CorreoDeliveryType;
    productType: string;
    agency?: string | null;
    address: {
      streetName: string;
      streetNumber: string;
      floor?: string;
      apartment?: string;
      city: string;
      provinceCode: string;
      postalCode: string;
    };
    weight: number;
    declaredValue: number;
    height: number;
    length: number;
    width: number;
  };
};

type CorreoImportShipmentResponse = {
  createdAt?: string;
  trackingNumber?: string;
  shippingId?: string;
  id?: string;
  code?: string;
  message?: string;
};

type CorreoTrackingEvent = {
  event?: string;
  date?: string;
  branch?: string;
  status?: string;
  sign?: string;
};

type CorreoTrackingItem = {
  id?: string | null;
  productId?: string | null;
  trackingNumber?: string;
  events?: CorreoTrackingEvent[];
  code?: string;
  error?: string;
};

type CorreoTrackingResponse = CorreoTrackingItem | CorreoTrackingItem[];

type OrderShippingInput = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStreet: string;
  customerStreetNumber?: string | null;
  customerFloor?: string | null;
  customerApartment?: string | null;
  customerCity: string;
  customerProvince: string;
  customerZip: string;
  total: number;
  shippingDeliveryType?: string | null;
  shippingProductType?: string | null;
  shippingAgency?: string | null;
};

type QuoteShippingInput = {
  postalCodeDestination: string;
  deliveredType?: CorreoDeliveryType;
  dimensions?: Partial<CorreoDimensions>;
};

const PROVINCE_CODE_MAP: Record<string, string> = {
  salta: "A",
  "provincia de buenos aires": "B",
  "buenos aires": "B",
  caba: "C",
  "capital federal": "C",
  "ciudad autonoma de buenos aires": "C",
  "ciudad autonoma buenos aires": "C",
  "ciudad de buenos aires": "C",
  "san luis": "D",
  "entre rios": "E",
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
  "rio negro": "R",
  "santa fe": "S",
  tucuman: "T",
  chubut: "U",
  "tierra del fuego": "V",
  corrientes: "W",
  cordoba: "X",
  jujuy: "Y",
  "santa cruz": "Z",
};

let cachedAuth: CorreoAuth | null = null;

function stripAccents(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function toCorreoProvinceCode(province: string): string {
  const normalized = stripAccents(province);
  return (
    PROVINCE_CODE_MAP[normalized] ??
    process.env.CORREO_ARGENTINO_DEFAULT_PROVINCE_CODE ??
    "B"
  );
}

function splitStreetAndNumber(street: string): {
  streetName: string;
  streetNumber: string;
} {
  const trimmed = street.trim();
  const match = trimmed.match(/^(.*?)(\d+[A-Za-z]?)\s*$/);
  if (!match) {
    return {
      streetName: trimmed || "SIN CALLE",
      streetNumber: "S/N",
    };
  }

  return {
    streetName: match[1].trim() || "SIN CALLE",
    streetNumber: match[2],
  };
}

function getBaseUrl() {
  return (process.env.CORREO_ARGENTINO_BASE_URL ?? "").replace(/\/+$/, "");
}

function getDefaultDimensions(overrides?: Partial<CorreoDimensions>) {
  return {
    weight: Math.trunc(
      overrides?.weight ?? Number(process.env.CORREO_ARGENTINO_DEFAULT_WEIGHT ?? 1000)
    ),
    height: Math.trunc(
      overrides?.height ?? Number(process.env.CORREO_ARGENTINO_DEFAULT_HEIGHT ?? 20)
    ),
    width: Math.trunc(
      overrides?.width ?? Number(process.env.CORREO_ARGENTINO_DEFAULT_WIDTH ?? 20)
    ),
    length: Math.trunc(
      overrides?.length ?? Number(process.env.CORREO_ARGENTINO_DEFAULT_LENGTH ?? 30)
    ),
  };
}

function ensureBaseConfigured() {
  const baseUrl = getBaseUrl();
  const apiUser = process.env.CORREO_ARGENTINO_API_USER ?? "";
  const apiPassword = process.env.CORREO_ARGENTINO_API_PASSWORD ?? "";
  const email = process.env.CORREO_ARGENTINO_MICORREO_EMAIL ?? "";
  const password = process.env.CORREO_ARGENTINO_MICORREO_PASSWORD ?? "";

  if (!baseUrl || !apiUser || !apiPassword || !email || !password) {
    throw new Error(
      "Correo Argentino no configurado: faltan BASE_URL, API_USER, API_PASSWORD, MICORREO_EMAIL o MICORREO_PASSWORD"
    );
  }

  return { baseUrl, apiUser, apiPassword, email, password };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    if (!response.ok) {
      throw new Error(`Correo Argentino error ${response.status}: ${text}`);
    }
    return text;
  }
}

async function requestJson<TResponse>(
  path: string,
  init: RequestInit,
  token?: string
): Promise<TResponse> {
  const { baseUrl } = ensureBaseConfigured();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: Object.fromEntries(headers.entries()),
    cache: "no-store",
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      `Correo Argentino error ${response.status}: ${JSON.stringify(data)}`
    );
  }

  return data as TResponse;
}

async function getCorreoAuth(): Promise<CorreoAuth> {
  if (cachedAuth) return cachedAuth;

  const { apiUser, apiPassword, email, password } = ensureBaseConfigured();
  const basicAuth = Buffer.from(`${apiUser}:${apiPassword}`).toString("base64");

  const tokenResponse = await requestJson<unknown>("/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basicAuth}` },
  });

  if (!isRecord(tokenResponse)) {
    throw new Error("Correo Argentino token invalido");
  }

  const token =
    asString(tokenResponse.token) ??
    asString(tokenResponse.access_token) ??
    asString(tokenResponse.accessToken);

  if (!token) {
    throw new Error("Correo Argentino token no recibido");
  }

  const customerResponse = await requestJson<unknown>(
    "/users/validate",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    token
  );

  if (!isRecord(customerResponse)) {
    throw new Error("Correo Argentino customerId invalido");
  }

  const customerId = asString(customerResponse.customerId);
  if (!customerId) {
    throw new Error("Correo Argentino customerId no recibido");
  }

  cachedAuth = { token, customerId };
  return cachedAuth;
}

export function resetCorreoArgentinoAuthCacheForTests() {
  cachedAuth = null;
}

export function isCorreoArgentinoConfigured() {
  return Boolean(
    getBaseUrl() &&
      process.env.CORREO_ARGENTINO_API_USER &&
      process.env.CORREO_ARGENTINO_API_PASSWORD &&
      process.env.CORREO_ARGENTINO_MICORREO_EMAIL &&
      process.env.CORREO_ARGENTINO_MICORREO_PASSWORD
  );
}

export async function quoteCorreoArgentinoShipping({
  postalCodeDestination,
  deliveredType,
  dimensions,
}: QuoteShippingInput): Promise<CorreoShippingRate[]> {
  const auth = await getCorreoAuth();
  const response = await requestJson<unknown>(
    "/rates",
    {
      method: "POST",
      body: JSON.stringify({
        customerId: auth.customerId,
        postalCodeOrigin: process.env.CORREO_ARGENTINO_ORIGIN_POSTAL_CODE ?? "",
        postalCodeDestination,
        ...(deliveredType ? { deliveredType } : {}),
        dimensions: getDefaultDimensions(dimensions),
      }),
    },
    auth.token
  );

  if (!isRecord(response) || !Array.isArray(response.rates)) {
    throw new Error("Respuesta de cotizacion invalida de Correo Argentino");
  }

  const validTo = asString(response.validTo);
  return response.rates
    .filter(isRecord)
    .map((rate) => ({
      deliveredType:
        rate.deliveredType === "S"
          ? ("S" as CorreoDeliveryType)
          : ("D" as CorreoDeliveryType),
      productType: asString(rate.productType) ?? "CP",
      productName: asString(rate.productName) ?? "Correo Argentino",
      price:
        typeof rate.price === "number"
          ? rate.price
          : Number(asString(rate.price) ?? 0),
      deliveryTimeMin: asString(rate.deliveryTimeMin),
      deliveryTimeMax: asString(rate.deliveryTimeMax),
      validTo,
    }))
    .filter((rate) => rate.price > 0);
}

export async function getCorreoArgentinoAgencies(
  province: string
): Promise<CorreoAgency[]> {
  const auth = await getCorreoAuth();
  const params = new URLSearchParams({
    customerId: auth.customerId,
    provinceCode: toCorreoProvinceCode(province),
  });

  const response = await requestJson<unknown>(
    `/agencies?${params.toString()}`,
    { method: "GET" },
    auth.token
  );

  if (!Array.isArray(response)) {
    throw new Error("Respuesta de sucursales invalida de Correo Argentino");
  }

  return response.filter(isRecord).map((agency) => {
    const location = isRecord(agency.location) ? agency.location : {};
    const address = isRecord(location.address) ? location.address : {};
    const streetName = asString(address.streetName);
    const streetNumber = asString(address.streetNumber);

    return {
      code: asString(agency.code) ?? "",
      name: asString(agency.name) ?? "Sucursal Correo Argentino",
      status: asString(agency.status),
      address:
        streetName && streetNumber
          ? `${streetName} ${streetNumber}`
          : streetName ?? null,
      city: asString(address.city),
      provinceCode: asString(address.provinceCode),
      postalCode: asString(address.postalCode),
    };
  });
}

export async function importOrderShipmentToCorreoArgentino(
  order: OrderShippingInput
) {
  const auth = await getCorreoAuth();
  const deliveryType =
    order.shippingDeliveryType === "S" || order.shippingDeliveryType === "D"
      ? order.shippingDeliveryType
      : ((process.env.CORREO_ARGENTINO_DEFAULT_DELIVERY_TYPE as
          | CorreoDeliveryType
          | undefined) ?? "D");

  const productType =
    order.shippingProductType ??
    process.env.CORREO_ARGENTINO_DEFAULT_PRODUCT_TYPE ??
    "CP";

  const fallbackAddress = splitStreetAndNumber(order.customerStreet);
  const dimensions = getDefaultDimensions();

  const payload: CorreoImportShipmentRequest = {
    customerId: auth.customerId,
    extOrderId: order.id,
    orderNumber: order.id.slice(-8).toUpperCase(),
    sender: {
      name: process.env.CORREO_ARGENTINO_SENDER_NAME ?? null,
      phone: process.env.CORREO_ARGENTINO_SENDER_PHONE ?? null,
      cellPhone: process.env.CORREO_ARGENTINO_SENDER_CELLPHONE ?? null,
      email: process.env.CORREO_ARGENTINO_SENDER_EMAIL ?? null,
      originAddress: {
        streetName: process.env.CORREO_ARGENTINO_ORIGIN_STREET ?? null,
        streetNumber: process.env.CORREO_ARGENTINO_ORIGIN_STREET_NUMBER ?? null,
        floor: process.env.CORREO_ARGENTINO_ORIGIN_FLOOR ?? null,
        apartment: process.env.CORREO_ARGENTINO_ORIGIN_APARTMENT ?? null,
        city: process.env.CORREO_ARGENTINO_ORIGIN_CITY ?? null,
        provinceCode: process.env.CORREO_ARGENTINO_ORIGIN_PROVINCE_CODE ?? null,
        postalCode: process.env.CORREO_ARGENTINO_ORIGIN_POSTAL_CODE ?? null,
      },
    },
    recipient: {
      name: order.customerName,
      phone: order.customerPhone,
      cellPhone: order.customerPhone,
      email: order.customerEmail,
    },
    shipping: {
      deliveryType,
      productType,
      agency:
        deliveryType === "S"
          ? order.shippingAgency ?? process.env.CORREO_ARGENTINO_DEFAULT_AGENCY ?? null
          : null,
      address: {
        streetName: order.customerStreet.trim() || fallbackAddress.streetName,
        streetNumber: order.customerStreetNumber?.trim() || fallbackAddress.streetNumber,
        floor: order.customerFloor?.trim() ?? "",
        apartment: order.customerApartment?.trim() ?? "",
        city: order.customerCity,
        provinceCode: toCorreoProvinceCode(order.customerProvince),
        postalCode: order.customerZip,
      },
      weight: dimensions.weight,
      declaredValue: Math.max(1, Number(order.total.toFixed(2))),
      height: dimensions.height,
      length: dimensions.length,
      width: dimensions.width,
    },
  };

  const data = await requestJson<CorreoImportShipmentResponse>(
    "/shipping/import",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    auth.token
  );

  if (data.code && data.code !== "200") {
    throw new Error(data.message ?? `Error de importacion: ${data.code}`);
  }

  return {
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    deliveryType,
    productType,
    trackingNumber: data.trackingNumber ?? null,
    shippingId: data.shippingId ?? data.id ?? order.id,
  };
}

function parseCorreoEventDate(value: string | undefined) {
  if (!value) return 0;
  const match = value.match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/
  );
  if (!match) return Date.parse(value) || 0;
  const [, day, month, year, hour, minute] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ).getTime();
}

export async function getCorreoArgentinoTracking(shippingId: string) {
  const auth = await getCorreoAuth();
  const params = new URLSearchParams({ shippingId });
  const raw = await requestJson<CorreoTrackingResponse>(
    `/shipping/tracking?${params.toString()}`,
    { method: "GET" },
    auth.token
  );

  const responseItem = Array.isArray(raw) ? raw[0] : raw;
  if (responseItem?.code && responseItem.error) {
    throw new Error(responseItem.error);
  }

  const events = responseItem?.events ?? [];
  const sortedEvents = [...events].sort(
    (a, b) => parseCorreoEventDate(b.date) - parseCorreoEventDate(a.date)
  );
  const lastEvent = sortedEvents.length > 0 ? sortedEvents[0]?.event ?? null : null;

  return {
    trackingNumber: responseItem?.trackingNumber ?? null,
    lastEvent,
    raw,
  };
}
