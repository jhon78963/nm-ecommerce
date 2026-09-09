/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";

import { COOKIE_CONSENT_STORAGE_KEY } from "@/features/cookies/constants/cookie-consent";
import { createCookieConsentPreferences } from "@/features/cookies/utils/cookie-consent-storage";
import { pushDataLayerEvent, trackPageView } from "@/features/analytics/utils/data-layer";
import { trackAddToCart } from "@/features/analytics/utils/ecommerce-events";

describe("analytics data layer", () => {
  beforeEach(() => {
    window.dataLayer = [];
    localStorage.clear();
  });

  it("no empuja eventos sin consentimiento analytics", () => {
    pushDataLayerEvent({ event: "test_event" });
    expect(window.dataLayer).toEqual([]);
  });

  it("empuja page_view cuando hay consentimiento", () => {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(createCookieConsentPreferences({ analytics: true })),
    );

    trackPageView("/buscar?q=polo", "Buscar");

    expect(window.dataLayer).toEqual([
      {
        event: "page_view",
        page_path: "/buscar?q=polo",
        page_title: "Buscar",
      },
    ]);
  });

  it("empuja add_to_cart con formato ecommerce GA4", () => {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(createCookieConsentPreferences({ analytics: true })),
    );

    trackAddToCart({
      productId: "prod-1",
      name: "Polo",
      price: 49.9,
      quantity: 2,
      variation: "M / Azul",
    });

    expect(window.dataLayer).toEqual([
      { ecommerce: null },
      {
        event: "add_to_cart",
        ecommerce: {
          currency: "PEN",
          value: 99.8,
          items: [
            {
              item_id: "prod-1",
              item_name: "Polo",
              price: 49.9,
              quantity: 2,
              item_variant: "M / Azul",
            },
          ],
        },
      },
    ]);
  });
});
