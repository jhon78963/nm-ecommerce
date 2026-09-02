"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ProductQuickViewModal } from "@/features/product/components/quick-view/ProductQuickViewModal";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface QuickViewContextValue {
  product: ProductBoxItem | null;
  openQuickView: (product: ProductBoxItem) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<ProductBoxItem | null>(null);

  const openQuickView = useCallback((nextProduct: ProductBoxItem) => {
    setProduct(nextProduct);
  }, []);

  const closeQuickView = useCallback(() => {
    setProduct(null);
  }, []);

  const value = useMemo(
    () => ({
      product,
      openQuickView,
      closeQuickView,
    }),
    [product, openQuickView, closeQuickView],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      {product ? <ProductQuickViewModal product={product} onClose={closeQuickView} /> : null}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);

  if (!context) {
    throw new Error("useQuickView must be used within QuickViewProvider");
  }

  return context;
}
