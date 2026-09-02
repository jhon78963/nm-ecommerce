"use client";

import { useMemo } from "react";

import { useCart } from "@/features/cart/context/CartProvider";

export function useProductCartItem(productId: string) {
  const { items } = useCart();

  return useMemo(
    () => items.find((item) => item.productId === productId) ?? null,
    [items, productId],
  );
}
