import { CART_STORAGE_KEY } from "@/features/cart/constants/cart-storage";
import type { CartLineItem } from "@/features/cart/types/cart.types";

function isCartLineItem(value: unknown): value is CartLineItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartLineItem>;

  return (
    typeof item.id === "string"
    && typeof item.productId === "string"
    && typeof item.name === "string"
    && typeof item.quantity === "number"
    && item.quantity > 0
    && typeof item.price === "number"
    && item.price >= 0
  );
}

export function readCartFromStorage(): CartLineItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartLineItem);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartLineItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
