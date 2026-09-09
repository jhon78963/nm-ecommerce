import type { CartLineItem } from "@/features/cart/types/cart.types";
import { resolveCartLineVariantIds } from "@/features/cart/utils/cart-variant";

function variantKey(item: Pick<CartLineItem, "productId" | "productSizeId" | "colorId" | "variationId">): string {
  const { productSizeId, colorId } = resolveCartLineVariantIds(item as CartLineItem);
  return `${item.productId}:${productSizeId ?? ""}:${colorId ?? ""}`;
}

function pickRicherLine(current: CartLineItem, candidate: CartLineItem): CartLineItem {
  return {
    ...current,
    name: candidate.name || current.name,
    imageUrl: candidate.imageUrl ?? current.imageUrl,
    variation: candidate.variation ?? current.variation,
    slug: candidate.slug ?? current.slug,
    price: candidate.price,
  };
}

export function mergeCartItems(local: CartLineItem[], remote: CartLineItem[]): CartLineItem[] {
  const merged = new Map<string, CartLineItem>();

  for (const item of [...remote, ...local]) {
    const key = variantKey(item);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, { ...item });
      continue;
    }

    merged.set(key, pickRicherLine(existing, {
      ...existing,
      ...item,
      quantity: existing.quantity + item.quantity,
    }));
  }

  return [...merged.values()];
}

export function toUpsertCartPayload(items: CartLineItem[]) {
  return items.map((item) => {
    const variant = resolveCartLineVariantIds(item);

    return {
      productId: item.productId,
      productSizeId: variant.productSizeId!,
      colorId: variant.colorId,
      name: item.name,
      variation: item.variation,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPrice: item.price,
    };
  });
}

export function mapServerCartLine(item: CartLineItem): CartLineItem {
  const variant = resolveCartLineVariantIds(item);

  return {
    ...item,
    id: item.id || `${item.productId}-${variant.productSizeId}-${variant.colorId ?? "default"}`,
    productSizeId: variant.productSizeId,
    colorId: variant.colorId,
  };
}
