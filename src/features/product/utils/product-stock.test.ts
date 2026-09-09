import { describe, expect, it } from "vitest";

import { mergeLiveStockIntoSizes } from "@/features/product/utils/merge-live-stock";
import { formatPdpStockLabel } from "@/features/product/utils/format-pdp-stock-label";

describe("mergeLiveStockIntoSizes", () => {
  it("updates size and color stock from live response", () => {
    const merged = mergeLiveStockIntoSizes(
      [
        {
          id: "size-1",
          label: "M",
          stock: 1,
          colors: [{ id: "color-1", label: "Azul", hex: "#000", stock: 1 }],
        },
      ],
      {
        productId: "prod-1",
        stockStatus: "in_stock",
        sizes: [{ id: "size-1", stock: 4, colors: [{ id: "color-1", stock: 2 }] }],
      },
    );

    expect(merged[0]?.stock).toBe(4);
    expect(merged[0]?.colors[0]?.stock).toBe(2);
  });
});

describe("formatPdpStockLabel", () => {
  it('returns "Quedan X unidades" for positive stock', () => {
    expect(formatPdpStockLabel(3)).toBe("Quedan 3 unidades");
  });

  it('returns "Agotado" for zero stock', () => {
    expect(formatPdpStockLabel(0)).toBe("Agotado");
  });
});
