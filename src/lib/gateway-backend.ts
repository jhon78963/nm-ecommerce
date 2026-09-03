import { env } from "@/config/env";

import { readUpstreamError } from "@/lib/ecommerce-backend";

export { readUpstreamError };

export async function proxyGatewayJson(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");
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
