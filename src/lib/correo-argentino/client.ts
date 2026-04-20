import {
  CorreoArgentinoImportRequest,
  CorreoArgentinoRateRequest,
  CorreoArgentinoRateResponse,
  CorreoArgentinoTokenResponse,
  CorreoArgentinoValidateUserRequest,
  CorreoArgentinoValidateUserResponse,
} from "@/lib/correo-argentino/types";

type JsonRecord = Record<string, unknown>;

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

class CorreoArgentinoError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "CorreoArgentinoError";
    this.status = status;
    this.details = details;
  }
}

let tokenCache:
  | {
      token: string;
      expiresAt: number;
    }
  | undefined;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }

  return value;
}

function getBaseUrl() {
  return getRequiredEnv("CORREO_ARGENTINO_BASE_URL").replace(/\/$/, "");
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(status: number, body: unknown) {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (status === 401 || status === 403) {
    return "No se pudo autenticar con Correo Argentino.";
  }

  if (status === 402 || status === 404) {
    return "Correo Argentino rechazó los datos enviados.";
  }

  if (RETRYABLE_STATUS_CODES.has(status)) {
    return "Correo Argentino no está disponible en este momento.";
  }

  return "Error desconocido al consumir Correo Argentino.";
}

async function fetchJson<T>(
  path: string,
  init: RequestInit,
  retryCount = 1,
): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
  });

  const body = await parseResponse(response);

  if (!response.ok) {
    if (retryCount > 0 && RETRYABLE_STATUS_CODES.has(response.status)) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return fetchJson<T>(path, init, retryCount - 1);
    }

    throw new CorreoArgentinoError(
      getErrorMessage(response.status, body),
      response.status,
      body,
    );
  }

  return body as T;
}

async function getBearerToken() {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 5_000) {
    return tokenCache.token;
  }

  const apiUser = getRequiredEnv("CORREO_ARGENTINO_API_USER");
  const apiPassword = getRequiredEnv("CORREO_ARGENTINO_API_PASSWORD");
  const auth = Buffer.from(`${apiUser}:${apiPassword}`).toString("base64");

  const response = await fetchJson<CorreoArgentinoTokenResponse>("/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  tokenCache = {
    token: response.token,
    expiresAt: new Date(response.expires).getTime(),
  };

  return response.token;
}

async function withAuthHeaders(headers?: HeadersInit) {
  const token = await getBearerToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...headers,
  };
}

export async function validateUser(
  payload: CorreoArgentinoValidateUserRequest,
) {
  return fetchJson<CorreoArgentinoValidateUserResponse>("/users/validate", {
    method: "POST",
    headers: await withAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function getRates(payload: CorreoArgentinoRateRequest) {
  return fetchJson<CorreoArgentinoRateResponse>("/rates", {
    method: "POST",
    headers: await withAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function importShipping(payload: CorreoArgentinoImportRequest) {
  const response = await fetchJson<JsonRecord | null>("/shipping/import", {
    method: "POST",
    headers: await withAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return response;
}

export { CorreoArgentinoError };
