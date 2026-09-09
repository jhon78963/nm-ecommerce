import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";

function pickRicherWishlistItem(
  current: WishlistStoredItem,
  candidate: WishlistStoredItem,
): WishlistStoredItem {
  return {
    ...current,
    ...candidate,
    name: candidate.name || current.name,
    imageUrl: candidate.imageUrl ?? current.imageUrl,
    slug: candidate.slug ?? current.slug,
    productSizeId: candidate.productSizeId ?? current.productSizeId,
    colorId: candidate.colorId ?? current.colorId,
    variation: candidate.variation ?? current.variation,
    price: candidate.price,
    addedAt:
      new Date(current.addedAt).getTime() <= new Date(candidate.addedAt).getTime()
        ? current.addedAt
        : candidate.addedAt,
  };
}

export function mergeWishlistItems(
  local: WishlistStoredItem[],
  remote: WishlistStoredItem[],
): WishlistStoredItem[] {
  const merged = new Map<string, WishlistStoredItem>();

  for (const item of [...remote, ...local]) {
    const existing = merged.get(item.productId);
    if (!existing) {
      merged.set(item.productId, { ...item });
      continue;
    }

    merged.set(item.productId, pickRicherWishlistItem(existing, item));
  }

  return [...merged.values()].sort(
    (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime(),
  );
}

export function toUpsertWishlistPayload(items: WishlistStoredItem[]) {
  return items.map((item) => ({
    productId: item.productId,
    productSizeId: item.productSizeId,
    colorId: item.colorId,
    name: item.name,
    variation: item.variation,
    imageUrl: item.imageUrl,
    unitPrice: item.price,
    addedAt: item.addedAt,
  }));
}

export function mapServerWishlistItem(item: WishlistStoredItem): WishlistStoredItem {
  return {
    ...item,
    productId: String(item.productId),
    addedAt: item.addedAt || new Date().toISOString(),
  };
}
