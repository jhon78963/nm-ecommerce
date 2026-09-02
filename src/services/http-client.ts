import { env } from "@/config/env";

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  token?: string;
  revalidate?: number | false;
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (env.apiAccessToken) {
    headers.Authorization = `Bearer ${env.apiAccessToken}`;
  }

  return headers;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, env.apiBaseUrl.endsWith("/") ? env.apiBaseUrl : `${env.apiBaseUrl}/`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { revalidate, cache, ...rest } = options;

  const response = await fetch(buildUrl(path, rest.params), {
    method: "GET",
    headers: getHeaders(rest.token),
    cache: cache ?? (revalidate !== undefined ? "force-cache" : "no-store"),
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new HttpError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    method: "POST",
    headers: getHeaders(options.token),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new HttpError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
