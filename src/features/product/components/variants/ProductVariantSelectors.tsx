"use client";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductColor, ProductSize } from "@/features/product/types/product-variant.types";
import { cn } from "@/lib/utils";

import "@/features/product/components/pdp/pdp.css";
import "./product-variant-selectors.css";

function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

interface ColorSwatchesProps {
  colors: ProductColor[];
  selectedColorId: string | null;
  onSelect: (id: string) => void;
}

function ColorSwatches({ colors, selectedColorId, onSelect }: ColorSwatchesProps) {
  if (colors.length === 0) {
    return <p className="product-variant-selectors__hint">Sin colores para esta talla</p>;
  }

  return (
    <div className="pdp-colors-grid" role="group" aria-label="Seleccionar color">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          className={cn("pdp-color-btn", isLightColor(color.hex) && "pdp-color-btn--light")}
          style={{ "--swatch-color": color.hex } as React.CSSProperties}
          aria-pressed={selectedColorId === color.id}
          aria-label={color.label}
          data-label={color.label}
          onClick={() => onSelect(color.id)}
          title={color.label}
        />
      ))}
    </div>
  );
}

interface SizeChipsProps {
  sizes: ProductSize[];
  selectedSizeId: string | null;
  onSelect: (id: string) => void;
}

function SizeChips({ sizes, selectedSizeId, onSelect }: SizeChipsProps) {
  return (
    <div className="pdp-sizes-grid" role="group" aria-label="Seleccionar talla">
      {sizes.map((size) => {
        const isSoldOut = size.stock === 0;
        const isLow = size.stock > 0 && size.stock <= 4;

        return (
          <button
            key={size.id}
            type="button"
            className={cn(
              "pdp-size-chip",
              isSoldOut && "pdp-size-chip--soldout",
              isLow && !isSoldOut && "pdp-size-chip--low-stock",
            )}
            aria-pressed={selectedSizeId === size.id}
            aria-label={isSoldOut ? `${size.label} — agotado` : size.label}
            disabled={isSoldOut}
            onClick={() => !isSoldOut && onSelect(size.id)}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}

interface ProductVariantSelectorsProps {
  sizes: ProductSize[];
  selectedSizeId: string | null;
  selectedColorId: string | null;
  selectedSize: ProductSize | null;
  selectedColor: ProductColor | null;
  availableColors: ProductColor[];
  onSizeSelect: (id: string) => void;
  onColorSelect: (id: string) => void;
  compact?: boolean;
}

export function ProductVariantSelectors({
  sizes,
  selectedSizeId,
  selectedColorId,
  selectedSize,
  selectedColor,
  availableColors,
  onSizeSelect,
  onColorSelect,
  compact = false,
}: ProductVariantSelectorsProps) {
  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className={cn("product-variant-selectors", compact && "product-variant-selectors--compact")}>
      <div className="pdp-selectors">
        <div className="pdp-selector-row">
          <div className="pdp-selector-label">
            {PDP_COPY.sizesLabel}
            {selectedSize ? <span>{selectedSize.label}</span> : null}
          </div>

          <SizeChips sizes={sizes} selectedSizeId={selectedSizeId} onSelect={onSizeSelect} />
        </div>

        <div className="pdp-selector-row">
          <div className="pdp-selector-label">
            {PDP_COPY.colorsLabel}
            {selectedColor ? <span>{selectedColor.label}</span> : null}
          </div>

          {selectedSizeId ? (
            <ColorSwatches
              colors={availableColors}
              selectedColorId={selectedColorId}
              onSelect={onColorSelect}
            />
          ) : (
            <p className="product-variant-selectors__hint">Selecciona una talla primero</p>
          )}
        </div>
      </div>
    </div>
  );
}
