import { PDP_COPY } from "@/features/product/constants/pdp-copy";

export function formatPdpStockLabel(stock: number | null): string | null {
  if (stock === null) {
    return null;
  }

  if (stock <= 0) {
    return PDP_COPY.outOfStock;
  }

  return PDP_COPY.remainingStock(stock);
}
