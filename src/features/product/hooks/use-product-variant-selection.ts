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

export function useProductVariantSelection(
  sizes: ProductSize[] = [],
  initialSelection?: ProductVariantInitialSelection,
  options?: UseProductVariantSelectionOptions,
) {
  const { productId, persist = false } = options ?? {};
  const shouldPersist = persist && Boolean(productId);

  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    () => resolveInitialSelection(sizes, initialSelection).sizeId,
  );
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    () => resolveInitialSelection(sizes, initialSelection).colorId,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(!shouldPersist);

  useEffect(() => {
    const resolved = resolveInitialSelection(sizes, initialSelection);
    if (!resolved.sizeId) {
      return;
    }

    setSelectedSizeId(resolved.sizeId);
    setSelectedColorId(resolved.colorId);
    setValidationError(null);
    setHasRestoredFromStorage(true);
  }, [initialSelection?.colorId, initialSelection?.sizeId, sizes]);

  useEffect(() => {
    if (!shouldPersist || !productId || initialSelection?.sizeId) {
      setHasRestoredFromStorage(true);
      return;
    }

    const stored = readProductVariantSelection(productId);
    const resolved = resolveInitialSelection(sizes, stored);

    if (resolved.sizeId) {
      setSelectedSizeId(resolved.sizeId);
      setSelectedColorId(resolved.colorId);
    }

    setHasRestoredFromStorage(true);
  }, [initialSelection?.sizeId, productId, shouldPersist, sizes]);

  useEffect(() => {
    if (!shouldPersist || !productId || !hasRestoredFromStorage) {
      return;
    }

    writeProductVariantSelection(productId, {
      sizeId: selectedSizeId,
      colorId: selectedColorId,
    });
  }, [hasRestoredFromStorage, productId, selectedColorId, selectedSizeId, shouldPersist]);

  const hasSizes = sizes.length > 0;
  const selectedSize = sizes.find((size) => size.id === selectedSizeId) ?? null;
  const availableColors = selectedSize?.colors ?? [];
  const selectedColor = availableColors.find((color) => color.id === selectedColorId) ?? null;

  useEffect(() => {
    if (!hasRestoredFromStorage || sizes.length !== 1 || selectedSizeId) {
      return;
    }

    const onlySize = sizes[0];
    if (!isUuid(onlySize.id)) {
      return;
    }

    setSelectedSizeId(onlySize.id);

    const colors = onlySize.colors ?? [];
    if (colors.length === 1 && isUuid(colors[0].id) && colors[0].stock > 0) {
      setSelectedColorId(colors[0].id);
    }
  }, [hasRestoredFromStorage, sizes, selectedSizeId]);

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
