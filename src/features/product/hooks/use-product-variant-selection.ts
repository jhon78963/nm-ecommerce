"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { isUuid } from "@/features/cart/utils/cart-variant";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import { PRODUCT_VARIANT_SELECTION_CHANGE_EVENT } from "@/features/product/constants/product-variant-selection-storage";
import type { ProductCartVariation, ProductSize } from "@/features/product/types/product-variant.types";
import {
  readStoredVariantSnapshot,
  writeProductVariantSelection,
} from "@/features/product/utils/product-variant-selection-storage";

export interface ProductVariantInitialSelection {
  sizeId?: string | null;
  colorId?: string | null;
}

export interface UseProductVariantSelectionOptions {
  productId?: string;
  persist?: boolean;
}

interface VariantSelection {
  sizeId: string | null;
  colorId: string | null;
}

function resolveInitialSelection(
  sizes: ProductSize[],
  initialSelection?: ProductVariantInitialSelection,
): VariantSelection {
  if (!initialSelection?.sizeId) {
    return { sizeId: null, colorId: null };
  }

  const size = sizes.find((item) => item.id === initialSelection.sizeId);
  if (!size || !isUuid(size.id)) {
    return { sizeId: null, colorId: null };
  }

  if (!initialSelection.colorId) {
    return { sizeId: size.id, colorId: null };
  }

  const color = size.colors?.find((item) => item.id === initialSelection.colorId);
  if (!color || !isUuid(color.id) || color.stock <= 0) {
    return { sizeId: size.id, colorId: null };
  }

  return { sizeId: size.id, colorId: color.id };
}

function resolveAutoSelection(sizes: ProductSize[]): VariantSelection {
  if (sizes.length !== 1) {
    return { sizeId: null, colorId: null };
  }

  const onlySize = sizes[0];
  if (!isUuid(onlySize.id)) {
    return { sizeId: null, colorId: null };
  }

  const colors = onlySize.colors ?? [];
  if (colors.length === 1 && isUuid(colors[0].id) && colors[0].stock > 0) {
    return { sizeId: onlySize.id, colorId: colors[0].id };
  }

  return { sizeId: onlySize.id, colorId: null };
}

function parseStoredSnapshot(snapshot: string): ProductVariantInitialSelection | null {
  if (!snapshot) {
    return null;
  }

  const separatorIndex = snapshot.indexOf(":");
  if (separatorIndex === -1) {
    return { sizeId: snapshot, colorId: null };
  }

  const sizeId = snapshot.slice(0, separatorIndex);
  const colorId = snapshot.slice(separatorIndex + 1);

  return {
    sizeId,
    colorId: colorId || null,
  };
}

function resolveDefaultSelection(
  sizes: ProductSize[],
  initialSelection?: ProductVariantInitialSelection,
  storedSelection?: ProductVariantInitialSelection | null,
  shouldPersist = false,
): VariantSelection {
  if (initialSelection?.sizeId) {
    return resolveInitialSelection(sizes, initialSelection);
  }

  if (shouldPersist && storedSelection) {
    const persisted = resolveInitialSelection(sizes, storedSelection);
    if (persisted.sizeId) {
      return persisted;
    }
  }

  return resolveAutoSelection(sizes);
}

function useStoredVariantSnapshot(productId: string | undefined, enabled: boolean) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!enabled || !productId) {
        return () => {};
      }

      const handler = () => onStoreChange();
      window.addEventListener(PRODUCT_VARIANT_SELECTION_CHANGE_EVENT, handler);
      window.addEventListener("storage", handler);

      return () => {
        window.removeEventListener(PRODUCT_VARIANT_SELECTION_CHANGE_EVENT, handler);
        window.removeEventListener("storage", handler);
      };
    },
    () => (enabled && productId ? readStoredVariantSnapshot(productId) : ""),
    () => "",
  );
}

function buildSelectionScope(
  productId: string | undefined,
  initialSelection?: ProductVariantInitialSelection,
) {
  return `${productId ?? ""}:${initialSelection?.sizeId ?? ""}:${initialSelection?.colorId ?? ""}`;
}

export function useProductVariantSelection(
  sizes: ProductSize[] = [],
  initialSelection?: ProductVariantInitialSelection,
  options?: UseProductVariantSelectionOptions,
) {
  const { productId, persist = false } = options ?? {};
  const shouldPersist = persist && Boolean(productId);
  const storedSnapshot = useStoredVariantSnapshot(productId, shouldPersist);
  const storedSelection = useMemo(
    () => parseStoredSnapshot(storedSnapshot),
    [storedSnapshot],
  );
  const selectionScope = buildSelectionScope(productId, initialSelection);

  const defaultSelection = useMemo(
    () => resolveDefaultSelection(sizes, initialSelection, storedSelection, shouldPersist),
    [initialSelection, shouldPersist, sizes, storedSelection],
  );

  const [userOverride, setUserOverride] = useState<{
    scope: string;
    selection: VariantSelection;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const activeOverride =
    userOverride?.scope === selectionScope ? userOverride.selection : null;
  const selectedSizeId = activeOverride?.sizeId ?? defaultSelection.sizeId;
  const selectedColorId = activeOverride?.colorId ?? defaultSelection.colorId;

  const hasSizes = sizes.length > 0;
  const selectedSize = sizes.find((size) => size.id === selectedSizeId) ?? null;
  const availableColors = selectedSize?.colors ?? [];
  const selectedColor = availableColors.find((color) => color.id === selectedColorId) ?? null;

  const cartVariation = useMemo<ProductCartVariation>(() => {
    const variation = [selectedSize?.label, selectedColor?.label].filter(Boolean).join(" — ");

    return {
      variation: variation || undefined,
      productSizeId: selectedSizeId ?? undefined,
      colorId: selectedColorId ?? undefined,
      variationId: selectedSizeId ?? undefined,
    };
  }, [selectedColor?.label, selectedSize?.label, selectedColorId, selectedSizeId]);

  function persistSelection(selection: VariantSelection) {
    if (!shouldPersist || !productId) {
      return;
    }

    writeProductVariantSelection(productId, selection);
  }

  function handleSizeSelect(id: string) {
    const selection = { sizeId: id, colorId: null };
    setUserOverride({
      scope: selectionScope,
      selection,
    });
    persistSelection(selection);
    setValidationError(null);
  }

  function handleColorSelect(id: string) {
    const selection = { sizeId: selectedSizeId, colorId: id };
    setUserOverride({
      scope: selectionScope,
      selection,
    });
    persistSelection(selection);
    setValidationError(null);
  }

  function validate(): boolean {
    if (!hasSizes) {
      return true;
    }

    if (!selectedSizeId) {
      setValidationError(PDP_COPY.selectSizeFirst);
      return false;
    }

    if (selectedSize && selectedSize.colors.length > 0) {
      const selectableColors = selectedSize.colors.filter((color) => color.stock > 0);

      if (selectableColors.length === 0) {
        setValidationError(PDP_COPY.agotadoParaTalla);
        return false;
      }

      if (!selectedColorId) {
        setValidationError(PDP_COPY.selectColorFirst);
        return false;
      }

      const selectedColorStock = selectedSize.colors.find((color) => color.id === selectedColorId);
      if (!selectedColorStock || selectedColorStock.stock === 0) {
        setValidationError(PDP_COPY.agotadoParaTalla);
        return false;
      }
    }

    setValidationError(null);
    return true;
  }

  return {
    hasSizes,
    sizes,
    selectedSizeId,
    selectedColorId,
    selectedSize,
    selectedColor,
    availableColors,
    validationError,
    cartVariation,
    handleSizeSelect,
    handleColorSelect,
    validate,
  };
}
