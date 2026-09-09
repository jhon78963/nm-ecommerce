export interface CookieConsentPreferences {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export interface CookieConsentContextValue {
  preferences: CookieConsentPreferences | null;
  isReady: boolean;
  showBanner: boolean;
  hasAnalyticsConsent: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  openPreferences: () => void;
}
