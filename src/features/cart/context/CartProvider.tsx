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

import {
  clearRemoteCartIfAuthenticated,
  useCartServerSync,
} from "@/features/cart/hooks/use-cart-server-sync";
import type { CartContextValue, CartLineItem } from "@/features/cart/types/cart.types";
import { readCartFromStorage, writeCartToStorage } from "@/features/cart/utils/cart-storage";
import { resolveCartLineVariantIds } from "@/features/cart/utils/cart-variant";
import { trackAddToCart } from "@/features/analytics";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { createLocalStorageStore, useLocalStorageItems } from "@/hooks/use-local-storage-items";

const cartStorage = createLocalStorageStore(
  readCartFromStorage,
  writeCartToStorage,
  "nm-cart-change",
);

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  freeShippingThreshold?: number;
}

export function CartProvider({
  children,
  freeShippingThreshold = 200,
}: CartProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, isHydrated, setItems } = useLocalStorageItems(cartStorage);
  const [isOpen, setIsOpen] = useState(false);

  useCartServerSync({
    isAuthenticated,
    authReady: !authLoading,
    isHydrated,
    items,
    setItems,
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback((open: boolean) => setIsOpen(open), []);

  const clearCart = useCallback(() => {
    setItems([]);
    void clearRemoteCartIfAuthenticated(isAuthenticated);
  }, [isAuthenticated, setItems]);

  const addItem = useCallback((item: Omit<CartLineItem, "id"> & { id?: string }) => {
    setItems((current) => {
      const incomingVariant = resolveCartLineVariantIds(item as CartLineItem);
      const existing = current.find((line) => {
        if (line.productId !== item.productId) {
          return false;
        }

        const lineVariant = resolveCartLineVariantIds(line);
        return (
          lineVariant.productSizeId === incomingVariant.productSizeId
          && lineVariant.colorId === incomingVariant.colorId
        );
      });

      if (existing) {
        trackAddToCart({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variation: item.variation,
        });

        return current.map((line) =>
          line.id === existing.id
            ? { ...line, quantity: line.quantity + item.quantity }
            : line,
        );
      }

      const variantKey =
        incomingVariant.productSizeId
        ?? item.variationId
        ?? "default";

      trackAddToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variation: item.variation,
      });

      return [
        ...current,
        {
          ...item,
          id: item.id ?? `${item.productId}-${variantKey}-${Date.now()}`,
        },
      ];
    });
  }, [setItems]);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, [setItems]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, [setItems]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      isHydrated,
      freeShippingThreshold,
      itemCount: items.length,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      clearCart,
      addItem,
      removeItem,
      updateQuantity,
    }),
    [
      items,
      isOpen,
      isHydrated,
      freeShippingThreshold,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      clearCart,
      addItem,
      removeItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
