"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { isAnalyticsConfigured } from "@/features/analytics/constants/analytics";
import { trackPageView } from "@/features/analytics/utils/data-layer";
import { useCookieConsent } from "@/features/cookies/context/CookieConsentProvider";

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isReady, hasAnalyticsConsent } = useCookieConsent();

  useEffect(() => {
    if (!isReady || !hasAnalyticsConsent || !isAnalyticsConfigured()) {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackPageView(pagePath);
  }, [pathname, searchParams, isReady, hasAnalyticsConsent]);

  return null;
}
