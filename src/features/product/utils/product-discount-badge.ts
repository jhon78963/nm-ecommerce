import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export type ProductDiscountBadgeKind = "percent" | "cash";

export interface ProductDiscountBadge {
  kind: ProductDiscountBadgeKind;
  label: string;
}

function parsePercentageDiscount(value?: string | number | null): number {
  if (value == null || value === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0;
}

function formatCashAmount(amount: number): string {
  const normalized = Math.round(amount * 100) / 100;
  return Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(2);
}

export function resolveProductDiscountBadge(
  product: Pick<
    ProductBoxItem,
    "discount" | "cashDiscount" | "percentageDiscount" | "price" | "salePrice" | "isOnSale"
  >,
): ProductDiscountBadge | null {
  const cashDiscount = product.cashDiscount ?? 0;
  if (cashDiscount > 0) {
    return {
      kind: "cash",
      label: `- S/${formatCashAmount(cashDiscount)}`,
    };
  }

  const configuredPercent = parsePercentageDiscount(product.percentageDiscount);
  if (configuredPercent > 0) {
    return {
      kind: "percent",
      label: `${configuredPercent}%`,
    };
  }

  if (product.isOnSale && product.price > product.salePrice && product.price > 0) {
    const computed = Math.round(((product.price - product.salePrice) / product.price) * 100);
    if (computed > 0) {
      return {
        kind: "percent",
        label: `${computed}%`,
      };
    }
  }

  if (product.discount > 0) {
    return {
      kind: "percent",
      label: `${Math.round(product.discount)}%`,
    };
  }

  return null;
}

export function hasProductPromoPrice(
  product: Pick<ProductBoxItem, "price" | "salePrice" | "discount" | "cashDiscount" | "isOnSale">,
): boolean {
  return (
    product.price > product.salePrice
    || product.discount > 0
    || (product.cashDiscount ?? 0) > 0
    || product.isOnSale === true
  );
}
