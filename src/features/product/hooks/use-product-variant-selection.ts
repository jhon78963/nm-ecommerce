"use client";

import { useEffect, useMemo, useState } from "react";

import { isUuid } from "@/features/cart/utils/cart-variant";
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

  useEffect(() => {
    if (sizes.length !== 1 || selectedSizeId) {
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
  }, [sizes, selectedSizeId]);

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
