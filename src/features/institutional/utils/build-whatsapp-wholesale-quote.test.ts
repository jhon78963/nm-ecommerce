import { describe, expect, it } from "vitest";

import {
  buildWholesaleQuoteRefToken,
  buildWholesaleQuoteWhatsAppMessage,
  buildWholesaleQuoteWhatsAppUrl,
} from "@/features/institutional/utils/build-whatsapp-wholesale-quote";

describe("buildWholesaleQuoteWhatsAppMessage", () => {
  it("includes business details and NM-B2B ref token", () => {
    const message = buildWholesaleQuoteWhatsAppMessage({
      quoteNumber: "B2B-20260909-1234",
      businessName: "Boutique La Esperanza",
      contactName: "María Pérez",
      phone: "999888777",
      city: "Trujillo",
      businessType: "tienda",
      productLines: "Damas y niños",
      estimatedUnits: "120 prendas",
      message: "Necesito lista mayorista actualizada.",
    });

    expect(message).toContain("solicito cotización mayorista");
    expect(message).toContain("B2B-20260909-1234");
    expect(message).toContain("Boutique La Esperanza");
    expect(message).toContain("[NM-B2B:source=web;ref=B2B-20260909-1234;city=trujillo;units=120-prendas]");
  });

  it("builds wa.me URL", () => {
    const url = buildWholesaleQuoteWhatsAppUrl({ businessName: "Mi Tienda" });
    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(url).toContain(encodeURIComponent("solicito cotización mayorista"));
  });
});

describe("buildWholesaleQuoteRefToken", () => {
  it("always includes source=web", () => {
    expect(buildWholesaleQuoteRefToken({})).toBe("[NM-B2B:source=web]");
  });
});
