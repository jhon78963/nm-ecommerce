"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type {
  WishlistContextValue,
  WishlistProductInput,
  WishlistStoredItem,
} from "@/features/wishlist/types/wishlist.types";
import { toWishlistStoredItem } from "@/features/wishlist/utils/to-wishlist-stored-item";
import {
  readWishlistFromStorage,
  writeWishlistToStorage,
} from "@/features/wishlist/utils/wishlist-storage";

const WishlistContext = createContext<WishlistContextValue | null>(null);

interface WishlistProviderProps {
  children: ReactNode;
}

function upsertWishlistItem(
  current: WishlistStoredItem[],
  product: WishlistProductInput,
  variant?: ProductCartVariation,
): WishlistStoredItem[] {
  const nextItem = toWishlistStoredItem(product, variant);
  const existing = current.find((item) => item.productId === nextItem.productId);

  if (!existing) {
    return [nextItem, ...current];
  }

  return current.map((item) =>
    item.productId === nextItem.productId
      ? {
          ...nextItem,
          addedAt: existing.addedAt,
        }
      : item,
  );
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [items, setItems] = useState<WishlistStoredItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readWishlistFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeWishlistToStorage(items);
  }, [items, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const addItem = useCallback((product: WishlistProductInput, variant?: ProductCartVariation) => {
    setItems((current) => upsertWishlistItem(current, product, variant));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const toggleItem = useCallback((product: WishlistProductInput, variant?: ProductCartVariation) => {
    setItems((current) => {
      const exists = current.some((item) => item.productId === String(product.id));

      if (exists) {
        return current.filter((item) => item.productId !== String(product.id));
      }

      return upsertWishlistItem(current, product, variant);
    });
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      itemCount: items.length,
      isHydrated,
      isInWishlist,
      addItem,
      removeItem,
      toggleItem,
      clearWishlist,
    }),
    [items, isHydrated, isInWishlist, addItem, removeItem, toggleItem, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
