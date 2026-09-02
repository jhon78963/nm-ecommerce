import { WISHLIST_STORAGE_KEY } from "@/features/wishlist/constants/wishlist-storage";
import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";

export function readWishlistFromStorage(): WishlistStoredItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as WishlistStoredItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWishlistToStorage(items: WishlistStoredItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}
