import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { ProductSize } from "@/features/product/types/product-variant.types";
import { getVariantStock } from "@/features/product/utils/get-variant-stock";
import type { WishlistStockStatus } from "@/features/wishlist/types/wishlist.types";

function sizeHasStock(size: ProductSize): boolean {
  if (size.colors.length > 0) {
    return size.colors.some((color) => color.stock > 0);
  }

  return size.stock > 0;
}

export function getWishlistItemStockStatus(
  sizes: ProductSize[] = [],
  variant?: ProductCartVariation,
): WishlistStockStatus {
  if (variant?.productSizeId) {
    const selectedSize = sizes.find((size) => size.id === variant.productSizeId) ?? null;
    const selectedColor = variant.colorId
      ? selectedSize?.colors.find((color) => color.id === variant.colorId) ?? null
      : null;
    const stock = getVariantStock(selectedSize, selectedColor);

    return stock !== null && stock > 0 ? "in_stock" : "out_of_stock";
  }

  return sizes.some(sizeHasStock) ? "in_stock" : "out_of_stock";
}

export function getStockStatusLabel(status: WishlistStockStatus) {
  return status === "in_stock" ? "En stock" : "Agotado";
}
