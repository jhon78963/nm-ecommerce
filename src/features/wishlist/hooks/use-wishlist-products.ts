"use client";

import { useEffect, useState } from "react";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface UseWishlistProductsResult {
  products: ProductBoxItem[];
  isLoading: boolean;
}

export function useWishlistProducts(productIds: string[]): UseWishlistProductsResult {
  const productIdsKey = productIds.join(",");
  const [snapshot, setSnapshot] = useState<{
    key: string;
    products: ProductBoxItem[];
    loading: boolean;
  }>({
    key: productIdsKey,
    products: [],
    loading: productIds.length > 0,
  });

  const isLoading =
    productIds.length > 0 && (snapshot.key !== productIdsKey || snapshot.loading);

  useEffect(() => {
    if (productIds.length === 0) {
      return;
    }

    const controller = new AbortController();

    async function loadProducts() {
      try {
        const params = new URLSearchParams({ ids: productIds.join(",") });
        const response = await fetch(`/api/wishlist?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setSnapshot({ key: productIdsKey, products: [], loading: false });
          return;
        }

        const data = (await response.json()) as { products: ProductBoxItem[] };
        setSnapshot({ key: productIdsKey, products: data.products, loading: false });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSnapshot({ key: productIdsKey, products: [], loading: false });
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [productIds, productIdsKey]);

  if (productIds.length === 0) {
    return { products: [], isLoading: false };
  }

  return {
    products: snapshot.key === productIdsKey ? snapshot.products : [],
    isLoading,
  };
}
