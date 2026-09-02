"use client";

import Link from "next/link";
import { Heart, Minus, Plus, RefreshCw, Share2, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/features/cart/context/CartProvider";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductDetail, ProductDetailColor, ProductDetailSize } from "@/features/product/types/product-detail.types";
import type { SearchProduct } from "@/features/search/types/search.types";
import { getProductHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface PdpInteractivePanelProps {
  product: ProductDetail;
}

function toWishlistProduct(product: ProductDetail): SearchProduct {
  return {
    id: String(product.id),
    name: product.name,
    isOnSale: product.discount > 0,
    sizes: [
      {
        id: `${product.id}-default`,
        salePrice: product.salePrice,
        stock: product.stockStatus === "in_stock" ? 10 : 0,
      },
    ],
  };
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

interface ColorSwatchesProps {
  colors: ProductDetailColor[];
  selectedColorId: string | null;
  onSelect: (id: string) => void;
}

function ColorSwatches({ colors, selectedColorId, onSelect }: ColorSwatchesProps) {
  if (colors.length === 0) {
    return <p className="text-sm text-gray-400 italic">Sin colores disponibles para esta talla</p>;
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
  sizes: ProductDetailSize[];
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
            aria-label={
              isSoldOut ? `${size.label} — agotado` : size.label
            }
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

export function PdpInteractivePanel({ product }: PdpInteractivePanelProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const hasSizes = Boolean(product.sizes?.length);
  const sizes = product.sizes ?? [];

  const selectedSize = sizes.find((s) => s.id === selectedSizeId) ?? null;
  const availableColors = selectedSize?.colors ?? [];
  const selectedColor = availableColors.find((c) => c.id === selectedColorId) ?? null;

  const isInStock = product.stockStatus === "in_stock";
  const isWishlisted = isInWishlist(String(product.id));
  const href = getProductHref(product.slug);

  function handleSizeSelect(id: string) {
    setSelectedSizeId(id);
    setSelectedColorId(null);
    setValidationError(null);
  }

  function handleColorSelect(id: string) {
    setSelectedColorId(id);
    setValidationError(null);
  }

  function updateQuantity(delta: number) {
    setQuantity((current) => Math.max(1, current + delta));
  }

  function validateAndAddToCart(buyNow = false) {
    if (hasSizes && !selectedSizeId) {
      setValidationError(PDP_COPY.selectSizeFirst);
      return;
    }

    if (selectedSize && selectedSize.colors.length > 0 && !selectedColorId) {
      setValidationError(PDP_COPY.selectColorFirst);
      return;
    }

    const variation = [selectedSize?.label, selectedColor?.label].filter(Boolean).join(" — ");

    addItem({
      productId: String(product.id),
      name: product.name,
      imageUrl: product.imageUrl,
      quantity,
      price: product.salePrice,
      variation: variation || undefined,
      variationId: selectedSizeId && selectedColorId
        ? `${selectedSizeId}-${selectedColorId}`
        : selectedSizeId ?? undefined,
    });

    if (buyNow) {
      window.location.href = "/checkout";
      return;
    }

    openCart();
  }

  /* Stock indicator for selected size */
  const stockQty = selectedSize?.stock ?? null;
  const showStockAlert = stockQty !== null && stockQty <= 5 && stockQty > 0;

  return (
    <div>
      {/* Selectors */}
      {hasSizes ? (
        <div className="pdp-selectors">
          {/* Size selector */}
          <div className="pdp-selector-row">
            <div className="pdp-selector-label">
              {PDP_COPY.sizesLabel}
              {selectedSize ? (
                <span>{selectedSize.label}</span>
              ) : null}
            </div>

            <SizeChips
              sizes={sizes}
              selectedSizeId={selectedSizeId}
              onSelect={handleSizeSelect}
            />
          </div>

          {/* Color selector */}
          <div className="pdp-selector-row">
            <div className="pdp-selector-label">
              {PDP_COPY.colorsLabel}
              {selectedColor ? (
                <span>{selectedColor.label}</span>
              ) : null}
            </div>

            {selectedSizeId ? (
              <ColorSwatches
                colors={availableColors}
                selectedColorId={selectedColorId}
                onSelect={handleColorSelect}
              />
            ) : (
              <p className="text-sm text-gray-400 italic">Selecciona una talla primero</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Stock alert for selected size */}
      {showStockAlert ? (
        <div className="pdp-stock-alert mt-4">
          <span>¡Solo quedan {stockQty} unidades!</span>
          <div className="pdp-stock-bar">
            <div
              className={cn("pdp-stock-bar__fill", stockQty <= 2 && "pdp-stock-bar__fill--danger")}
              style={{ width: `${(stockQty / 10) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {/* Validation error */}
      {validationError ? (
        <p className="pdp-selection-error mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {validationError}
        </p>
      ) : null}

      {/* Quantity + Cart actions */}
      <div className="product-buttons mt-5">
        <div className="qty-section">
          <div className="qty-box">
            <div className="input-group">
              <button
                type="button"
                className="btn quantity-left-minus"
                onClick={() => updateQuantity(-1)}
                aria-label="Disminuir cantidad"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="text"
                name="quantity"
                className="form-control input-number"
                value={quantity}
                readOnly
                aria-label="Cantidad"
              />
              <button
                type="button"
                className="btn quantity-left-plus"
                onClick={() => updateQuantity(1)}
                aria-label="Aumentar cantidad"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="product-buy-btn-group">
          <button
            type="button"
            className="btn btn-solid buy-button"
            disabled={!isInStock}
            onClick={() => validateAndAddToCart(false)}
          >
            <ShoppingCart className="me-1 inline size-4" aria-hidden="true" />
            {isInStock ? PDP_COPY.addToCart : PDP_COPY.outOfStock}
          </button>

          <button
            type="button"
            className="pdp-btn-outline buy-button"
            disabled={!isInStock}
            onClick={() => validateAndAddToCart(true)}
          >
            {PDP_COPY.buyNow}
          </button>
        </div>
      </div>

      {/* Secondary actions */}
      <div className="compare-box buy-box">
        <button
          type="button"
          className="quick-view-action-link"
          onClick={() => toggleItem(toWishlistProduct(product))}
        >
          <Heart
            className={cn("size-4", isWishlisted && "fill-theme text-theme")}
            aria-hidden="true"
          />
          <span>{isWishlisted ? PDP_COPY.removeFromWishlist : PDP_COPY.addToWishlist}</span>
        </button>

        <button
          type="button"
          className="quick-view-action-link"
          onClick={(e) => e.preventDefault()}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          <span>{PDP_COPY.compare}</span>
        </button>

        <button
          type="button"
          className="quick-view-action-link"
          onClick={(e) => e.preventDefault()}
        >
          <Share2 className="size-4" aria-hidden="true" />
          <span>{PDP_COPY.share}</span>
        </button>
      </div>
    </div>
  );
}
