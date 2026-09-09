import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from "@/features/cookies/constants/cookie-consent";
import type { CookieConsentPreferences } from "@/features/cookies/types/cookie-consent.types";

function isPreferences(value: unknown): value is CookieConsentPreferences {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<CookieConsentPreferences>;
  return (
    record.version === COOKIE_CONSENT_VERSION
    && record.necessary === true
    && typeof record.analytics === "boolean"
    && typeof record.marketing === "boolean"
    && typeof record.decidedAt === "string"
  );
}

export function readCookieConsentFromStorage(): CookieConsentPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    return isPreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCookieConsentToStorage(preferences: CookieConsentPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(preferences));
}

export function createCookieConsentPreferences(options: {
  analytics: boolean;
  marketing?: boolean;
}): CookieConsentPreferences {
  return {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics: options.analytics,
    marketing: options.marketing ?? options.analytics,
    decidedAt: new Date().toISOString(),
  };
}
