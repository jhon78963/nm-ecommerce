import { formatPrice } from "@/features/cart/utils/format-price";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { getProductHref } from "@/lib/routes";

export function formatProductBoxPrice(amount: number): string {
  return formatPrice(amount);
}

export function getProductBoxHref(product: Pick<ProductBoxItem, "slug" | "href">): string {
  return product.href ?? getProductHref(product.slug);
}
