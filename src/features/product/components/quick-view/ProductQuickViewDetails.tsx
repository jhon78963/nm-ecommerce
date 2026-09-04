"use client";

import Link from "next/link";
import { ArrowLeftRight, Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/features/cart/context/CartProvider";
import { cartLineHasValidVariant } from "@/features/cart/utils/cart-variant";
import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { QUICK_VIEW_COPY } from "@/features/product/constants/quick-view-copy";
import { ProductWhatsAppInquiryLink } from "@/features/product/components/ProductWhatsAppInquiryLink";
import { ProductVariantSelectors } from "@/features/product/components/variants/ProductVariantSelectors";
import {
  useProductVariantSelection,
  type ProductVariantInitialSelection,
} from "@/features/product/hooks/use-product-variant-selection";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import { clampQuantity, getVariantStock } from "@/features/product/utils/get-variant-stock";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import { buildProductHrefWithVariants } from "@/features/product/utils/product-variant-url";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import { isStarFilled } from "@/features/product/utils/product-rating";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

interface ProductQuickViewDetailsProps {
  product: ProductBoxItem;
  initialSelection?: ProductVariantInitialSelection;
  onClose: () => void;
}

function ProductRating({ rating, reviewsCount }: { rating: number | null; reviewsCount: number }) {
  return (
    <div className="product-rating">
      <div className="rating-list flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-4",
              isStarFilled(rating ?? 0, index) ? "fill-[#ffbc37] text-[#ffbc37]" : "fill-[#ddd] text-[#ddd]",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="divider">|</span>
      <span>
        {reviewsCount} {QUICK_VIEW_COPY.reviews}
      </span>
    </div>
  );
}

export function ProductQuickViewDetails({
  product,
  initialSelection,
  onClose,
}: ProductQuickViewDetailsProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const enrichedProduct = useMemo(() => enrichProductWithVariants(product), [product]);
  const variantSelection = useProductVariantSelection(enrichedProduct.sizes, initialSelection, {
    productId: String(product.id),
    persist: true,
  });

  const href = buildProductHrefWithVariants(getProductBoxHref(product), {
    sizeId: variantSelection.selectedSizeId,
    colorId: variantSelection.selectedColorId,
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
  const canAddToCart =
    isInStock
    && (!variantSelection.hasSizes || Boolean(variantSelection.selectedSizeId))
    && cartLineHasValidVariant(
      productBoxItemToCartLineItem(product, 1, variantSelection.cartVariation),
    );

  function updateQuantity(delta: number) {
    setQuantity((current) => clampQuantity(current + delta, maxQuantity));
  }

  function handleAddToCart() {
    if (!isInStock || !variantSelection.validate()) {
      return;
    }

    if (availableStock !== null && quantity > availableStock) {
      return;
    }

    const lineItem = productBoxItemToCartLineItem(product, quantity, variantSelection.cartVariation);
    if (!cartLineHasValidVariant(lineItem)) {
      return;
    }

    addItem(lineItem);
    onClose();
    openCart();
  }

  return (
    <div className="product-page-details right-sidebar-modal">
      <Link href={href} onClick={onClose}>
        <h2 className="main-title" id="quick-view-title">
          {product.name}
        </h2>
      </Link>

      <ProductRating rating={product.ratingCount} reviewsCount={product.reviewsCount} />

      <div className="price-text">
        <h3>
          {formatProductBoxPrice(product.salePrice)}
          {product.discount > 0 ? (
            <>
              <del>{formatProductBoxPrice(product.price)}</del>
              <span className="discounted-price">
                {product.discount}% {QUICK_VIEW_COPY.off}
              </span>
            </>
          ) : null}
        </h3>
        <span>{QUICK_VIEW_COPY.inclusiveText}</span>
      </div>

      {variantSelection.hasSizes ? (
        <>
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

          {variantSelection.validationError ? (
            <p className="product-variant-selectors__error">{variantSelection.validationError}</p>
          ) : null}
        </>
      ) : null}

      <div className="product-buttons">
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
            disabled={!canAddToCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="me-1 inline size-4" aria-hidden="true" />
            {isInStock ? QUICK_VIEW_COPY.addToCart : QUICK_VIEW_COPY.outOfStock}
          </button>
          <Link
            href={href}
            className={cn("btn btn-solid buy-button", !isInStock && "pointer-events-none opacity-60")}
            onClick={onClose}
          >
            {QUICK_VIEW_COPY.buyNow}
          </Link>
        </div>
      </div>

      <div className="compare-box buy-box">
        <button
          type="button"
          onClick={() => toggleItem(product, variantSelection.cartVariation)}
          className="quick-view-action-link"
        >
          <Heart className={cn("size-4", isWishlisted && "fill-theme text-theme")} />
          <span>{PRODUCT_COPY.addToWishlist}</span>
        </button>
        <ProductWhatsAppInquiryLink
          label={QUICK_VIEW_COPY.whatsappInquiry}
          productName={product.name}
          sizeLabel={variantSelection.hasSizes ? variantSelection.selectedSize?.label ?? null : undefined}
          colorLabel={
            variantSelection.hasSizes && variantSelection.selectedSize
              ? variantSelection.selectedColor?.label ?? null
              : undefined
          }
          barcode={product.sku}
          productPath={href}
        />
      </div>

      <div className="bordered-box">
        <h4 className="sub-title">{QUICK_VIEW_COPY.deliveryDetails}</h4>
        <ul className="product-offer">
          <li>
            <Truck className="size-5 shrink-0" aria-hidden="true" />
            {QUICK_VIEW_COPY.estimatedDelivery}
          </li>
          <li>
            <ArrowLeftRight className="size-5 shrink-0" aria-hidden="true" />
            {QUICK_VIEW_COPY.returnPolicy}
          </li>
        </ul>
      </div>
    </div>
  );
}
