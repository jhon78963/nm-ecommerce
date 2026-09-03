"use client";

import { useEffect, useState } from "react";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface UseWishlistProductsResult {
  products: ProductBoxItem[];
  isLoading: boolean;
}

export function useWishlistProducts(productIds: string[]): UseWishlistProductsResult {
  const [products, setProducts] = useState<ProductBoxItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({ ids: productIds.join(",") });
        const response = await fetch(`/api/wishlist?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setProducts([]);
          return;
        }

        const data = (await response.json()) as { products: ProductBoxItem[] };
        setProducts(data.products);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [productIds.join(",")]);

  return { products, isLoading };
}
