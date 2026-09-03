import type { ProductColor, ProductSize } from "@/features/product/types/product-variant.types";

export function getVariantStock(
  selectedSize: ProductSize | null,
  selectedColor: ProductColor | null,
): number | null {
  if (!selectedSize) {
    return null;
  }

  if (selectedSize.colors.length > 0) {
    if (!selectedColor) {
      return null;
    }

    return selectedColor.stock;
  }

  return selectedSize.stock;
}

export function clampQuantity(quantity: number, maxQuantity: number): number {
  if (maxQuantity <= 0) {
    return 1;
  }

  return Math.max(1, Math.min(maxQuantity, quantity));
}
