import { beforeEach, describe, expect, it, vi } from "vitest";

import { COOKIE_CONSENT_STORAGE_KEY, COOKIE_CONSENT_VERSION } from "@/features/cookies/constants/cookie-consent";
import {
  createCookieConsentPreferences,
  readCookieConsentFromStorage,
  writeCookieConsentToStorage,
} from "@/features/cookies/utils/cookie-consent-storage";

describe("cookie-consent-storage", () => {
  beforeEach(() => {
    const storage = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    vi.stubGlobal("window", { localStorage: storage });
    vi.stubGlobal("localStorage", storage);
  });

  it("persists and reads consent preferences", () => {
    const preferences = createCookieConsentPreferences({
      analytics: false,
      marketing: false,
    });

    writeCookieConsentToStorage(preferences);
    expect(readCookieConsentFromStorage()).toEqual(preferences);
  });

  it("rejects invalid stored payloads", () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify({ version: 999 }));
    expect(readCookieConsentFromStorage()).toBeNull();
  });

  it("creates versioned preferences", () => {
    const preferences = createCookieConsentPreferences({ analytics: true });
    expect(preferences.version).toBe(COOKIE_CONSENT_VERSION);
    expect(preferences.necessary).toBe(true);
  });
});
