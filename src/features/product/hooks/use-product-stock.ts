"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchProductStock } from "@/features/product/services/product-stock.client";
import type { ProductStockResponse } from "@/features/product/types/product-stock.types";
import type { ProductSize } from "@/features/product/types/product-variant.types";
import { mergeLiveStockIntoSizes } from "@/features/product/utils/merge-live-stock";

const REFRESH_MS = 45_000;

function resolveInitialStockStatus(sizes: ProductSize[]): "in_stock" | "out_of_stock" {
  return sizes.some((size) => size.stock > 0 || size.colors.some((color) => color.stock > 0))
    ? "in_stock"
    : "out_of_stock";
}

export function useProductStock(productId: string, initialSizes: ProductSize[]) {
  const [sizes, setSizes] = useState(initialSizes);
  const [stockStatus, setStockStatus] = useState<"in_stock" | "out_of_stock">(
    resolveInitialStockStatus(initialSizes),
  );

  const applyStock = useCallback(
    (stock: ProductStockResponse, baseSizes: ProductSize[]) => {
      setSizes(mergeLiveStockIntoSizes(baseSizes, stock));
      setStockStatus(stock.stockStatus);
    },
    [],
  );

  useEffect(() => {
    // Reset live stock when the server-provided size list changes (e.g. navigation).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync props to client state
    setSizes(initialSizes);
    setStockStatus(resolveInitialStockStatus(initialSizes));
  }, [initialSizes]);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const stock = await fetchProductStock(productId);
        if (!cancelled) {
          applyStock(stock, initialSizes);
        }
      } catch {
        // Keep SSR snapshot when live stock is unavailable.
      }
    }

    void refresh();
    const timer = window.setInterval(refresh, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [applyStock, initialSizes, productId]);

  return { sizes, stockStatus };
}
