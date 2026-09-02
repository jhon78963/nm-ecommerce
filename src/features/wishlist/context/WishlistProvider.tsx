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

import type { SearchProduct } from "@/features/search/types/search.types";
import type { WishlistContextValue, WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";
import { getProductMinPrice } from "@/features/search/utils/product";
import {
  readWishlistFromStorage,
  writeWishlistToStorage,
} from "@/features/wishlist/utils/wishlist-storage";

const WishlistContext = createContext<WishlistContextValue | null>(null);

interface WishlistProviderProps {
  children: ReactNode;
}

function toStoredItem(product: SearchProduct): WishlistStoredItem {
  return {
    productId: product.id,
    name: product.name,
    price: getProductMinPrice(product),
    addedAt: new Date().toISOString(),
  };
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

  const addItem = useCallback((product: SearchProduct) => {
    setItems((current) => {
      if (current.some((item) => item.productId === product.id)) {
        return current;
      }

      return [toStoredItem(product), ...current];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const toggleItem = useCallback((product: SearchProduct) => {
    setItems((current) => {
      const exists = current.some((item) => item.productId === product.id);
      if (exists) {
        return current.filter((item) => item.productId !== product.id);
      }

      return [toStoredItem(product), ...current];
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
