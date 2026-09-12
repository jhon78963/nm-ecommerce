import { env } from "@/config/env";

/** Origin for absolute links shared from the storefront (WhatsApp, etc.). */
export function getPublicSiteOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return env.appUrl.replace(/\/$/, "");
}

export function buildAbsolutePublicUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getPublicSiteOrigin()}${normalizedPath}`;
}
