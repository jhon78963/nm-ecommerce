import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";
import {
  mapServerWishlistItem,
  toUpsertWishlistPayload,
} from "@/features/wishlist/utils/wishlist-merge";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string; error?: string };
    return body.message || body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchCustomerWishlist(): Promise<WishlistStoredItem[]> {
  const response = await fetch("/api/account/wishlist");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar tus favoritos."));
  }

  const body = (await response.json()) as { items?: WishlistStoredItem[] };
  return (body.items ?? []).map(mapServerWishlistItem);
}

export async function saveCustomerWishlist(
  items: WishlistStoredItem[],
): Promise<WishlistStoredItem[]> {
  const response = await fetch("/api/account/wishlist", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: toUpsertWishlistPayload(items) }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron guardar tus favoritos."));
  }

  const body = (await response.json()) as { items?: WishlistStoredItem[] };
  return (body.items ?? []).map(mapServerWishlistItem);
}

export async function clearCustomerWishlist(): Promise<void> {
  const response = await fetch("/api/account/wishlist", { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw new Error(await parseError(response, "No se pudieron vaciar tus favoritos."));
  }
}
