import {
  PRODUCT_VARIANT_SELECTION_CHANGE_EVENT,
  PRODUCT_VARIANT_SELECTION_STORAGE_KEY,
} from "@/features/product/constants/product-variant-selection-storage";
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

  const serialized = JSON.stringify(selections);
  const existing = window.localStorage.getItem(PRODUCT_VARIANT_SELECTION_STORAGE_KEY);
  if (existing === serialized) {
    return;
  }

  window.localStorage.setItem(PRODUCT_VARIANT_SELECTION_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(PRODUCT_VARIANT_SELECTION_CHANGE_EVENT));
}

function selectionSnapshot(productId: string): string {
  const selection = readAllSelections()[productId];
  if (!selection?.sizeId) {
    return "";
  }

  return `${selection.sizeId}:${selection.colorId ?? ""}`;
}

export function readStoredVariantSnapshot(productId: string): string {
  return selectionSnapshot(productId);
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
  const existing = current[productId];

  if (!selection.sizeId) {
    if (!existing) {
      return;
    }

    delete current[productId];
    writeAllSelections(current);
    return;
  }

  const nextColorId = selection.colorId ?? null;
  if (existing?.sizeId === selection.sizeId && (existing.colorId ?? null) === nextColorId) {
    return;
  }

  current[productId] = {
    sizeId: selection.sizeId,
    colorId: nextColorId,
  };
  writeAllSelections(current);
}

export function clearProductVariantSelection(productId: string) {
  const current = readAllSelections();
  delete current[productId];
  writeAllSelections(current);
}
