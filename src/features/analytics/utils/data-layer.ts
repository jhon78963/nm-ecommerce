import type { DataLayerEvent } from "@/features/analytics/types/data-layer.types";
import { readCookieConsentFromStorage } from "@/features/cookies/utils/cookie-consent-storage";

function canPushAnalyticsEvent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const preferences = readCookieConsentFromStorage();
  return preferences?.analytics === true;
}

export function pushDataLayerEvent(event: DataLayerEvent): void {
  if (!canPushAnalyticsEvent()) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function clearEcommerceDataLayer(): void {
  pushDataLayerEvent({ ecommerce: null });
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  pushDataLayerEvent({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
  });
}
