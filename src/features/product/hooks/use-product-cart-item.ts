"use client";

import { useMemo } from "react";

import { useCart } from "@/features/cart/context/CartProvider";

export function useProductCartItem(productId: string, variationId?: string) {
  const { items } = useCart();

  return useMemo(
    () =>
      items.find(
        (item) =>
          item.productId === productId
          && (variationId ? item.variationId === variationId : !item.variationId),
      ) ?? null,
    [items, productId, variationId],
  );
}
