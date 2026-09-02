import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export function formatProductBoxPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getProductBoxHref(product: Pick<ProductBoxItem, "slug" | "href">): string {
  return product.href ?? `/product/${product.slug}`;
}
