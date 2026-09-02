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

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  initialItems?: CartLineItem[];
  freeShippingThreshold?: number;
}

export function CartProvider({
  children,
  initialItems = [],
  freeShippingThreshold = 200,
}: CartProviderProps) {
  const [items, setItems] = useState<CartLineItem[]>(initialItems);
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback((open: boolean) => setIsOpen(open), []);

  const clearCart = useCallback(() => setItems([]), []);

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
      freeShippingThreshold,
      itemCount: items.length,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      clearCart,
      removeItem,
      updateQuantity,
    }),
    [
      items,
      isOpen,
      freeShippingThreshold,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      clearCart,
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
