import { PRODUCT_VARIANT_SELECTION_STORAGE_KEY } from "@/features/product/constants/product-variant-selection-storage";
import type { ProductVariantInitialSelection } from "@/features/product/hooks/use-product-variant-selection";

type StoredSelections = Record<string, ProductVariantInitialSelection>;

function readAllSelections(): StoredSelections {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_VARIANT_SELECTION_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as StoredSelections;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAllSelections(selections: StoredSelections) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRODUCT_VARIANT_SELECTION_STORAGE_KEY, JSON.stringify(selections));
}

export function readProductVariantSelection(
  productId: string,
): ProductVariantInitialSelection | undefined {
  const selection = readAllSelections()[productId];
  if (!selection?.sizeId) {
    return undefined;
  }

  return {
    sizeId: selection.sizeId,
    colorId: selection.colorId ?? null,
  };
}

export function writeProductVariantSelection(
  productId: string,
  selection: ProductVariantInitialSelection,
) {
  const current = readAllSelections();

  if (!selection.sizeId) {
    delete current[productId];
    writeAllSelections(current);
    return;
  }

  current[productId] = {
    sizeId: selection.sizeId,
    colorId: selection.colorId ?? null,
  };
  writeAllSelections(current);
}

export function clearProductVariantSelection(productId: string) {
  const current = readAllSelections();
  delete current[productId];
  writeAllSelections(current);
}
