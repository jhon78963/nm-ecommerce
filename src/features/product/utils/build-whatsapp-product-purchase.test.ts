import { describe, expect, it } from "vitest";

import {
  appendWhatsAppUtmParams,
  buildPdpPurchaseRefToken,
  buildWhatsAppProductPurchaseMessage,
  buildWhatsAppProductPurchaseUrl,
} from "@/features/product/utils/build-whatsapp-product-purchase";

describe("buildWhatsAppProductPurchaseMessage", () => {
  it("includes purchase intent, SKU, link and NM-PDP ref token", () => {
    const message = buildWhatsAppProductPurchaseMessage({
      productId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      productName: "Vestido Floral",
      quantity: 2,
      unitPriceLabel: "S/ 89.90",
      sizeLabel: "M",
      colorLabel: "Azul",
      sku: "7890123456789",
      productUrl: "https://novedadesmaritex.net.pe/producto/vestido-floral-a1b2c3d4",
    });

    expect(message).toContain("quiero comprar este producto");
    expect(message).toContain("Producto: Vestido Floral");
    expect(message).toContain("Cantidad: 2");
    expect(message).toContain("SKU: 7890123456789");
    expect(message).toContain("utm_source=whatsapp");
    expect(message).toContain("[NM-PDP:pid=a1b2c3d4;qty=2;sku=7890123456789]");
  });

  it("builds wa.me URL with encoded message", () => {
    const url = buildWhatsAppProductPurchaseUrl({
      productId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      productName: "Polo Niño",
      quantity: 1,
      unitPriceLabel: "S/ 45.00",
    });

    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(url).toContain(encodeURIComponent("quiero comprar este producto"));
  });
});

describe("buildPdpPurchaseRefToken", () => {
  it("normalizes product id prefix", () => {
    expect(
      buildPdpPurchaseRefToken({
        productId: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
        quantity: 1,
      }),
    ).toBe("[NM-PDP:pid=a1b2c3d4;qty=1]");
  });
});

describe("appendWhatsAppUtmParams", () => {
  it("adds campaign params without dropping existing query", () => {
    const url = appendWhatsAppUtmParams(
      "https://novedadesmaritex.net.pe/producto/test-a1b2c3d4?size=1",
    );

    expect(url).toContain("size=1");
    expect(url).toContain("utm_medium=pdp");
  });
});
