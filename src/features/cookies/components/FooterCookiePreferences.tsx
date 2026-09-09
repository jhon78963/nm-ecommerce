"use client";

import { CookiePreferencesTrigger } from "@/features/cookies/components/CookieConsentBanner";

export function FooterCookiePreferences() {
  return (
    <div className="footer-cookie-preferences">
      <CookiePreferencesTrigger />
    </div>
  );
}
