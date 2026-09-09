"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CookieConsentContextValue, CookieConsentPreferences } from "@/features/cookies/types/cookie-consent.types";
import {
  createCookieConsentPreferences,
  readCookieConsentFromStorage,
  writeCookieConsentToStorage,
} from "@/features/cookies/utils/cookie-consent-storage";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function persistPreferences(preferences: CookieConsentPreferences) {
  writeCookieConsentToStorage(preferences);
  window.dispatchEvent(new CustomEvent("nm-cookie-consent-change"));
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookieConsentPreferences | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = readCookieConsentFromStorage();
    setPreferences(stored);
    setShowBanner(stored === null);
    setIsReady(true);
  }, []);

  const applyPreferences = useCallback((next: CookieConsentPreferences) => {
    setPreferences(next);
    persistPreferences(next);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    applyPreferences(createCookieConsentPreferences({ analytics: true, marketing: true }));
  }, [applyPreferences]);

  const rejectNonEssential = useCallback(() => {
    applyPreferences(createCookieConsentPreferences({ analytics: false, marketing: false }));
  }, [applyPreferences]);

  const openPreferences = useCallback(() => {
    setShowBanner(true);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preferences,
      isReady,
      showBanner,
      hasAnalyticsConsent: preferences?.analytics === true,
      acceptAll,
      rejectNonEssential,
      openPreferences,
    }),
    [preferences, isReady, showBanner, acceptAll, rejectNonEssential, openPreferences],
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
