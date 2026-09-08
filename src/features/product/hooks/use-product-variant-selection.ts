"use client";

import { useEffect, useMemo, useState } from "react";

import { isUuid } from "@/features/cart/utils/cart-variant";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductCartVariation, ProductSize } from "@/features/product/types/product-variant.types";
import {
  readProductVariantSelection,
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

function resolveInitialSelection(
  sizes: ProductSize[],
  initialSelection?: ProductVariantInitialSelection,
): { sizeId: string | null; colorId: string | null } {
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

function resolveAutoSelection(sizes: ProductSize[]): { sizeId: string | null; colorId: string | null } {
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

function resolveDefaultSelection(
  sizes: ProductSize[],
  initialSelection?: ProductVariantInitialSelection,
  storedSelection?: ProductVariantInitialSelection | null,
  shouldPersist = false,
): { sizeId: string | null; colorId: string | null } {
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

export function useProductVariantSelection(
  sizes: ProductSize[] = [],
  initialSelection?: ProductVariantInitialSelection,
  options?: UseProductVariantSelectionOptions,
) {
  const { productId, persist = false } = options ?? {};
  const shouldPersist = persist && Boolean(productId);

  const storedSelection =
    shouldPersist && productId && typeof window !== "undefined"
      ? readProductVariantSelection(productId)
      : null;

  const defaultSelection = useMemo(
    () => resolveDefaultSelection(sizes, initialSelection, storedSelection, shouldPersist),
    [initialSelection, shouldPersist, sizes, storedSelection],
  );

  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(defaultSelection.sizeId);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(defaultSelection.colorId);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [appliedSelectionKey, setAppliedSelectionKey] = useState(
    () => `${defaultSelection.sizeId ?? ""}:${defaultSelection.colorId ?? ""}`,
  );

  const defaultSelectionKey = `${defaultSelection.sizeId ?? ""}:${defaultSelection.colorId ?? ""}`;

  if (defaultSelectionKey !== appliedSelectionKey) {
    setAppliedSelectionKey(defaultSelectionKey);
    setSelectedSizeId(defaultSelection.sizeId);
    setSelectedColorId(defaultSelection.colorId);
    setValidationError(null);
  }

  useEffect(() => {
    if (!shouldPersist || !productId) {
      return;
    }

    writeProductVariantSelection(productId, {
      sizeId: selectedSizeId,
      colorId: selectedColorId,
    });
  }, [productId, selectedColorId, selectedSizeId, shouldPersist]);

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

  function handleSizeSelect(id: string) {
    setSelectedSizeId(id);
    setSelectedColorId(null);
    setValidationError(null);
  }

  function handleColorSelect(id: string) {
    setSelectedColorId(id);
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
