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
import type { ProductVariantInitialSelection } from "@/features/product/hooks/use-product-variant-selection";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface QuickViewState {
  product: ProductBoxItem;
  initialSelection: ProductVariantInitialSelection;
}

interface QuickViewContextValue {
  product: ProductBoxItem | null;
  openQuickView: (product: ProductBoxItem, initialSelection?: ProductVariantInitialSelection) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [quickViewState, setQuickViewState] = useState<QuickViewState | null>(null);

  const openQuickView = useCallback(
    (nextProduct: ProductBoxItem, initialSelection: ProductVariantInitialSelection = {}) => {
      setQuickViewState({ product: nextProduct, initialSelection });
    },
    [],
  );

  const closeQuickView = useCallback(() => {
    setQuickViewState(null);
  }, []);

  const value = useMemo(
    () => ({
      product: quickViewState?.product ?? null,
      openQuickView,
      closeQuickView,
    }),
    [quickViewState?.product, openQuickView, closeQuickView],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      {quickViewState ? (
        <ProductQuickViewModal
          product={quickViewState.product}
          initialSelection={quickViewState.initialSelection}
          onClose={closeQuickView}
        />
      ) : null}
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
