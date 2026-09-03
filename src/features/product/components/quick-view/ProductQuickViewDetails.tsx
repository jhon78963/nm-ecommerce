"use client";

import Link from "next/link";
import { ArrowLeftRight, Heart, Minus, Plus, RefreshCw, Share2, ShoppingCart, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/features/cart/context/CartProvider";
import { cartLineHasValidVariant } from "@/features/cart/utils/cart-variant";
import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { QUICK_VIEW_COPY } from "@/features/product/constants/quick-view-copy";
import { ProductVariantSelectors } from "@/features/product/components/variants/ProductVariantSelectors";
import { useProductVariantSelection } from "@/features/product/hooks/use-product-variant-selection";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

interface ProductQuickViewDetailsProps {
  product: ProductBoxItem;
  onClose: () => void;
}

function toWishlistProduct(product: ProductBoxItem): SearchProduct {
  return {
    id: String(product.id),
    name: product.name,
    isOnSale: product.discount > 0,
    sizes: [
      {
        id: `${product.id}-size`,
        salePrice: product.salePrice,
        stock: product.stockStatus === "in_stock" ? 10 : 0,
      },
    ],
  };
}

function ProductRating({ rating, reviewsCount }: { rating: number | null; reviewsCount: number }) {
  const value = rating ?? 0;

  return (
    <div className="product-rating">
      <div className="rating-list flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-4",
              value >= index + 1 ? "fill-[#ffbc37] text-[#ffbc37]" : "fill-[#ddd] text-[#ddd]",
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

export function ProductQuickViewDetails({ product, onClose }: ProductQuickViewDetailsProps) {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const enrichedProduct = useMemo(() => enrichProductWithVariants(product), [product]);
  const variantSelection = useProductVariantSelection(enrichedProduct.sizes);

  const href = getProductBoxHref(product);
  const isInStock = product.stockStatus === "in_stock";
  const isWishlisted = isInWishlist(String(product.id));
  const canAddToCart =
    isInStock
    && (!variantSelection.hasSizes || Boolean(variantSelection.selectedSizeId))
    && cartLineHasValidVariant(
      productBoxItemToCartLineItem(product, 1, variantSelection.cartVariation),
    );

  function updateQuantity(delta: number) {
    setQuantity((current) => Math.max(1, current + delta));
  }

  function handleAddToCart() {
    if (!isInStock || !variantSelection.validate()) {
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
          onClick={() => toggleItem(toWishlistProduct(product))}
          className="quick-view-action-link"
        >
          <Heart className={cn("size-4", isWishlisted && "fill-theme text-theme")} />
          <span>{PRODUCT_COPY.addToWishlist}</span>
        </button>
        <button type="button" className="quick-view-action-link" onClick={(event) => event.preventDefault()}>
          <RefreshCw className="size-4" />
          <span>{PRODUCT_COPY.compare}</span>
        </button>
        <button type="button" className="quick-view-action-link" onClick={(event) => event.preventDefault()}>
          <Share2 className="size-4" />
          <span>Compartir</span>
        </button>
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
