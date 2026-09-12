"use client";

import { useEffect, useRef } from "react";

import {
  clearCustomerCart,
  fetchCustomerCart,
  saveCustomerCart,
} from "@/features/cart/services/cart.service";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { mergeCartItems } from "@/features/cart/utils/cart-merge";

interface UseCartServerSyncOptions {
  isAuthenticated: boolean;
  authReady: boolean;
  isHydrated: boolean;
  items: CartLineItem[];
  setItems: (value: CartLineItem[] | ((current: CartLineItem[]) => CartLineItem[])) => void;
}

const SAVE_DEBOUNCE_MS = 600;

export function useCartServerSync({
  isAuthenticated,
  authReady,
  isHydrated,
  items,
  setItems,
}: UseCartServerSyncOptions) {
  const syncCompletedRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSnapshotRef = useRef<string>("");
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!isAuthenticated) {
      syncCompletedRef.current = false;
      lastSavedSnapshotRef.current = "";
      return;
    }

    if (!isHydrated || syncCompletedRef.current) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const [serverItems] = await Promise.all([fetchCustomerCart()]);
        const localItems = itemsRef.current;

        if (cancelled) {
          return;
        }

        const merged = mergeCartItems(localItems, serverItems);
        applyingRemoteRef.current = true;
        setItems(merged);
        applyingRemoteRef.current = false;

        const saved = merged.length > 0 ? await saveCustomerCart(merged) : [];
        if (cancelled) {
          return;
        }

        if (saved.length > 0) {
          applyingRemoteRef.current = true;
          setItems(saved);
          applyingRemoteRef.current = false;
          lastSavedSnapshotRef.current = JSON.stringify(saved);
        } else {
          lastSavedSnapshotRef.current = JSON.stringify(merged);
        }

        syncCompletedRef.current = true;
      } catch {
        syncCompletedRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthenticated, isHydrated, setItems]);

  useEffect(() => {
    if (!isAuthenticated || !syncCompletedRef.current || applyingRemoteRef.current) {
      return;
    }

    const snapshot = JSON.stringify(items);
    if (snapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void saveCustomerCart(items)
        .then((saved) => {
          lastSavedSnapshotRef.current = JSON.stringify(saved);
          applyingRemoteRef.current = true;
          setItems(saved);
          applyingRemoteRef.current = false;
        })
        .catch(() => {
          lastSavedSnapshotRef.current = snapshot;
        });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [isAuthenticated, items, setItems]);
}

export async function clearRemoteCartIfAuthenticated(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    return;
  }

  try {
    await clearCustomerCart();
  } catch {
    // Local cart is already cleared; ignore remote failures.
  }
}
