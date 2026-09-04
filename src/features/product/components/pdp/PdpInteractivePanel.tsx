"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/features/cart/context/CartProvider";
import { ProductWhatsAppInquiryLink } from "@/features/product/components/ProductWhatsAppInquiryLink";
import { ProductVariantSelectors } from "@/features/product/components/variants/ProductVariantSelectors";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import { useProductVariantSelection } from "@/features/product/hooks/use-product-variant-selection";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import { getProductBoxHref } from "@/features/product/utils/format-product-price";
import { clampQuantity, getVariantStock } from "@/features/product/utils/get-variant-stock";
import { buildProductHrefWithVariants, parseVariantSearchParams } from "@/features/product/utils/product-variant-url";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

interface PdpInteractivePanelProps {
  product: ProductDetail;
}

export function PdpInteractivePanel({ product }: PdpInteractivePanelProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const searchParams = useSearchParams();

  const enrichedProduct = useMemo(() => enrichProductWithVariants(product), [product]);
  const initialSelection = useMemo(() => parseVariantSearchParams(searchParams), [searchParams]);
  const variantSelection = useProductVariantSelection(enrichedProduct.sizes, initialSelection, {
    productId: String(product.id),
    persist: true,
  });

  const isInStock = product.stockStatus === "in_stock";
  const isWishlisted = isInWishlist(String(product.id));

  const availableStock = useMemo(
    () => getVariantStock(variantSelection.selectedSize, variantSelection.selectedColor),
    [variantSelection.selectedColor, variantSelection.selectedSize],
  );

  const maxQuantity = availableStock !== null && availableStock > 0 ? availableStock : 1;
  const canIncreaseQuantity = quantity < maxQuantity;

  useEffect(() => {
    setQuantity((current) => clampQuantity(current, maxQuantity));
  }, [
    maxQuantity,
    variantSelection.selectedColorId,
    variantSelection.selectedSizeId,
  ]);

  function updateQuantity(delta: number) {
    setQuantity((current) => clampQuantity(current + delta, maxQuantity));
  }

  function validateAndAddToCart(buyNow = false) {
    if (!variantSelection.validate()) {
      return;
    }

    if (availableStock !== null && quantity > availableStock) {
      return;
    }

    addItem({
      productId: String(product.id),
      productSizeId: variantSelection.cartVariation.productSizeId,
      colorId: variantSelection.cartVariation.colorId,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity,
      price: product.salePrice,
      variation: variantSelection.cartVariation.variation,
      variationId: variantSelection.cartVariation.variationId,
    });

    if (buyNow) {
      window.location.href = "/checkout";
      return;
    }

    openCart();
  }

  const stockQty = availableStock;
  const showStockAlert = stockQty !== null && stockQty <= 5 && stockQty > 0;
  const productPath = buildProductHrefWithVariants(getProductBoxHref(product), {
    sizeId: variantSelection.selectedSizeId,
    colorId: variantSelection.selectedColorId,
  });

  return (
    <div>
      {variantSelection.hasSizes ? (
        <ProductVariantSelectors
          sizes={variantSelection.sizes}
          selectedSizeId={variantSelection.selectedSizeId}
          selectedColorId={variantSelection.selectedColorId}
          selectedSize={variantSelection.selectedSize}
          selectedColor={variantSelection.selectedColor}
          availableColors={variantSelection.availableColors}
          onSizeSelect={variantSelection.handleSizeSelect}
          onColorSelect={variantSelection.handleColorSelect}
        />
      ) : null}

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

      {variantSelection.validationError ? (
        <p className="pdp-selection-error mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {variantSelection.validationError}
        </p>
      ) : null}

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
                disabled={!canIncreaseQuantity}
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

      <div className="compare-box buy-box">
        <button
          type="button"
          className="quick-view-action-link"
          onClick={() => toggleItem(product, variantSelection.cartVariation)}
        >
          <Heart
            className={cn("size-4", isWishlisted && "fill-theme text-theme")}
            aria-hidden="true"
          />
          <span>{isWishlisted ? PDP_COPY.removeFromWishlist : PDP_COPY.addToWishlist}</span>
        </button>

        <ProductWhatsAppInquiryLink
          label={PDP_COPY.whatsappInquiry}
          productName={product.name}
          sizeLabel={variantSelection.hasSizes ? variantSelection.selectedSize?.label ?? null : undefined}
          colorLabel={
            variantSelection.hasSizes && variantSelection.selectedSize
              ? variantSelection.selectedColor?.label ?? null
              : undefined
          }
          barcode={product.sku}
          productPath={productPath}
        />
      </div>
    </div>
  );
}
