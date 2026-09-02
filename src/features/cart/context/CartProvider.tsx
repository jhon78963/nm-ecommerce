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

import type { CartContextValue, CartLineItem } from "@/features/cart/types/cart.types";
import { readCartFromStorage, writeCartToStorage } from "@/features/cart/utils/cart-storage";

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  freeShippingThreshold?: number;
}

export function CartProvider({
  children,
  freeShippingThreshold = 200,
}: CartProviderProps) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeCartToStorage(items);
  }, [items, isHydrated]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback((open: boolean) => setIsOpen(open), []);

  const clearCart = useCallback(() => setItems([]), []);

  const addItem = useCallback((item: Omit<CartLineItem, "id"> & { id?: string }) => {
    setItems((current) => {
      const existing = current.find(
        (line) => line.productId === item.productId && line.variationId === item.variationId,
      );

      if (existing) {
        return current.map((line) =>
          line.id === existing.id
            ? { ...line, quantity: line.quantity + item.quantity }
            : line,
        );
      }

      return [
        ...current,
        {
          ...item,
          id: item.id ?? `${item.productId}-${item.variationId ?? "default"}-${Date.now()}`,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.id !== id));
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

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
