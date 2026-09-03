import { env } from "@/config/env";

/** URL directa al ecommerce-service (evita JWT del gateway en checkout público). */
export function getEcommerceServiceBaseUrl(): string {
  const configured = process.env.ECOMMERCE_SERVICE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return "http://localhost:3012";
}

/** Solo disponible en rutas API / server components (STORE_WAREHOUSE_ID no va al cliente). */
export function getStoreWarehouseId(): string {
  const warehouseId = env.storeWarehouseId;
  if (!warehouseId) {
    throw new Error("STORE_WAREHOUSE_ID no está configurado.");
  }

  return warehouseId;
}

export async function proxyEcommerceJson(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const baseUrl = getEcommerceServiceBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export async function readUpstreamError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
      errors?: { validation?: string[] };
    };

    if (Array.isArray(body.errors?.validation) && body.errors.validation.length > 0) {
      return body.errors.validation.join(". ");
    }

    if (typeof body.message === "string") {
      return body.message;
    }

    if (Array.isArray(body.message)) {
      return body.message.join(". ");
    }
  } catch {
    // ignore parse errors
  }

  return "No pudimos procesar tu pedido. Intenta nuevamente.";
}
