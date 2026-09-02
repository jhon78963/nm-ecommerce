import { formatPrice } from "@/features/cart/utils/format-price";
import type { SearchProduct } from "@/features/search/types/search.types";
import { getProductHref as buildProductHref } from "@/lib/routes";
import { resolveProductSlug } from "@/utils/product-slug";

export function getProductMinPrice(product: SearchProduct) {
  const prices = product.sizes?.map((size) => size.salePrice).filter((price) => price > 0) ?? [];
  return prices.length > 0 ? Math.min(...prices) : 0;
}

export function getProductHref(product: SearchProduct) {
  return buildProductHref(resolveProductSlug(product));
}

export function formatProductPrice(product: SearchProduct) {
  return formatPrice(getProductMinPrice(product));
}
