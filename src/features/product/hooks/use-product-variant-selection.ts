"use client";

import { useMemo, useState } from "react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductCartVariation, ProductSize } from "@/features/product/types/product-variant.types";

export function useProductVariantSelection(sizes: ProductSize[] = []) {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const hasSizes = sizes.length > 0;
  const selectedSize = sizes.find((size) => size.id === selectedSizeId) ?? null;
  const availableColors = selectedSize?.colors ?? [];
  const selectedColor = availableColors.find((color) => color.id === selectedColorId) ?? null;

  const cartVariation = useMemo<ProductCartVariation>(() => {
    const variation = [selectedSize?.label, selectedColor?.label].filter(Boolean).join(" — ");

    return {
      variation: variation || undefined,
      variationId:
        selectedSizeId && selectedColorId
          ? `${selectedSizeId}-${selectedColorId}`
          : selectedSizeId ?? undefined,
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

    if (selectedSize && selectedSize.colors.length > 0 && !selectedColorId) {
      setValidationError(PDP_COPY.selectColorFirst);
      return false;
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
