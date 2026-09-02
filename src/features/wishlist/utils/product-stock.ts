import type { SearchProduct } from "@/features/search/types/search.types";
import type { WishlistStockStatus } from "@/features/wishlist/types/wishlist.types";

export function getProductStockStatus(product: SearchProduct): WishlistStockStatus {
  const hasStock = product.sizes?.some((size) => size.stock > 0) ?? false;
  return hasStock ? "in_stock" : "out_of_stock";
}

export function getStockStatusLabel(status: WishlistStockStatus) {
  return status === "in_stock" ? "En stock" : "Agotado";
}
