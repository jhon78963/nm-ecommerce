import type { CartLineItem } from "@/features/cart/types/cart.types";
import { ROUTES } from "@/lib/routes";

export function getCartItemHref(item: CartLineItem): string {
  return ROUTES.product(item.slug ?? item.productId);
}

export function getCartItemLineTotal(item: CartLineItem): number {
  return item.price * item.quantity;
}
