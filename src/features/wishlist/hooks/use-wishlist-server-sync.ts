"use client";

import { useEffect, useRef } from "react";

import {
  fetchCustomerWishlist,
  saveCustomerWishlist,
} from "@/features/wishlist/services/account-wishlist.service";
import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";
import { mergeWishlistItems } from "@/features/wishlist/utils/wishlist-merge";

interface UseWishlistServerSyncOptions {
  isAuthenticated: boolean;
  authReady: boolean;
  isHydrated: boolean;
  items: WishlistStoredItem[];
  setItems: (
    value: WishlistStoredItem[] | ((current: WishlistStoredItem[]) => WishlistStoredItem[]),
  ) => void;
}

const SAVE_DEBOUNCE_MS = 600;

export function useWishlistServerSync({
  isAuthenticated,
  authReady,
  isHydrated,
  items,
  setItems,
}: UseWishlistServerSyncOptions) {
  const syncCompletedRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSnapshotRef = useRef<string>("");
  const itemsRef = useRef(items);
  itemsRef.current = items;

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
        const serverItems = await fetchCustomerWishlist();
        const localItems = itemsRef.current;

        if (cancelled) {
          return;
        }

        const merged = mergeWishlistItems(localItems, serverItems);
        applyingRemoteRef.current = true;
        setItems(merged);
        applyingRemoteRef.current = false;

        const saved = merged.length > 0 ? await saveCustomerWishlist(merged) : [];
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
      void saveCustomerWishlist(items)
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
