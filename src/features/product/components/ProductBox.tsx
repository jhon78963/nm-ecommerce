"use client";

import type { MouseEvent } from "react";
import { useMemo } from "react";
import { Heart, RefreshCw, Star } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import Link from "next/link";

import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { CartButton } from "@/features/product/components/cart-button/CartButton";
import { ProductCornerRibbon } from "@/features/product/components/ProductCornerRibbon";
import { ProductDiscountBadge } from "@/features/product/components/ProductDiscountBadge";
import { ProductQuickViewButton } from "@/features/product/components/quick-view/ProductQuickViewButton";
import { ProductVariantSelectors } from "@/features/product/components/variants/ProductVariantSelectors";
import { useProductVariantSelection } from "@/features/product/hooks/use-product-variant-selection";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import {
  hasProductPromoPrice,
  resolveProductDiscountBadge,
} from "@/features/product/utils/product-discount-badge";
import { isStarFilled } from "@/features/product/utils/product-rating";
import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

import "./product-box.css";

const actionButtonClass =
  "flex h-[clamp(26px,2.2vw,32px)] w-[clamp(26px,2.2vw,32px)] cursor-pointer items-center justify-center rounded-full border-none bg-white p-0 text-theme no-underline shadow-[0_5px_12px_rgba(155,155,155,0.05)] [&_svg]:h-[clamp(14px,1.1vw,17px)] [&_svg]:w-[clamp(14px,1.1vw,17px)]";

interface ProductBoxProps {
  product: ProductBoxItem;
  fullHeight?: boolean;
  featured?: boolean;
}

function toWishlistProduct(product: ProductBoxItem): SearchProduct {
  return {
    id: String(product.id),
    name: product.name,
    isOnSale: hasProductPromoPrice(product),
    sizes: [
      {
        id: `${product.id}-size`,
        salePrice: product.salePrice,
        stock: product.stockStatus === "in_stock" ? 10 : 0,
      },
    ],
  };
}

function ProductRating({ rating }: { rating: number | null }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = isStarFilled(rating ?? 0, index);

        return (
          <Star
            key={index}
            className={cn("h-3.5 w-3.5", filled ? "fill-theme text-theme" : "fill-[#ddd] text-[#ddd]")}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

function WishlistIcon({ product }: { product: ProductBoxItem }) {
  const { isInWishlist, toggleItem } = useWishlist();
  const wishlistProduct = toWishlistProduct(product);
  const active = isInWishlist(String(product.id));

  return (
    <a
      href="#"
      title={PRODUCT_COPY.addToWishlist}
      className={actionButtonClass}
      onClick={(event) => {
        event.preventDefault();
        toggleItem(wishlistProduct);
      }}
    >
      <Heart className={cn(active && "fill-theme")} />
    </a>
  );
}

export function ProductBox({ product, fullHeight = false, featured = false }: ProductBoxProps) {
  const enrichedProduct = useMemo(() => enrichProductWithVariants(product), [product]);
  const variantSelection = useProductVariantSelection(enrichedProduct.sizes);
  const discountBadge = useMemo(() => resolveProductDiscountBadge(product), [product]);
  const showOriginalPrice = hasProductPromoPrice(product) && product.price > product.salePrice;

  const href = getProductBoxHref(product);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const preventDefault = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const hoverActionClass = cn(
    actionButtonClass,
    "opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100",
  );

  return (
    <div
      className={cn(
        "group relative min-w-0 border border-[#f1f1f1] p-[clamp(7px,0.8vw,12px)] transition-all duration-500 ease-in-out",
        fullHeight ? "flex h-full flex-col" : "flex flex-col",
        featured && "product-box-featured",
      )}
    >
      <div className="relative z-0 aspect-square w-full shrink-0 overflow-hidden bg-[#f8f8f8]">
        {discountBadge ? (
          <ProductDiscountBadge
            badge={discountBadge}
            className={cn(
              "absolute left-2.5",
              product.isNew || product.isFeatured ? "bottom-2.5" : "top-2.5",
            )}
          />
        ) : null}

        {product.isNew ? (
          <ProductCornerRibbon label="Nuevo" position="left" />
        ) : product.isFeatured ? (
          <ProductCornerRibbon label="Destacado" position="left" variant="dark" />
        ) : null}

        <div className="group/zoom absolute inset-0 overflow-hidden">
          <Link href={href} className="relative block h-full w-full">
            <StoreImage
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={cn(
                "product-box__image object-cover transition-transform duration-500 ease-in-out group-hover/zoom:scale-110",
                isOutOfStock && "pointer-events-none grayscale",
              )}
            />
          </Link>
        </div>

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 max-md:top-2 max-md:right-2 max-md:gap-1">
          <WishlistIcon product={product} />

          <ul className="m-0 flex list-none flex-col gap-2 p-0 max-md:gap-1 [&>li:empty]:hidden group-hover:[&>li:nth-child(3)_a]:animate-[product-box-fade-in-down_700ms_ease-in-out] group-hover:[&>li:nth-child(4)_a]:animate-[product-box-fade-in-down_1s_ease-in-out]">
            <li />
            <li />
            <li>
              <ProductQuickViewButton product={product} className={hoverActionClass} />
            </li>
            <li>
              <a href="#" title={PRODUCT_COPY.compare} className={hoverActionClass} onClick={preventDefault}>
                <RefreshCw />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "mt-[15px] min-w-0",
          fullHeight && "flex flex-1 flex-col",
          featured && "mt-[18px]",
        )}
      >
        <Link
          href={href}
          title={product.name}
          className={cn(
            "product-box__title mb-1.5 block min-w-0 overflow-hidden font-medium text-[#222] capitalize no-underline transition-colors duration-500 hover:text-theme",
            featured
              ? "line-clamp-2 h-[2.6em] text-[clamp(17px,1.25vw,20px)] leading-[1.3]"
              : "line-clamp-2 h-[2.5em] text-[clamp(16px,1.1vw,18px)] leading-[1.25]",
          )}
        >
          {product.name}
        </Link>

        <div className="mb-1.5 flex items-center gap-1">
          <ProductRating rating={product.ratingCount} />
          <span className="text-[clamp(13px,0.9vw,14px)] text-[#777]">({product.reviewsCount})</span>
        </div>

        <h4
          className={cn(
            "product-box__price m-0 flex flex-wrap items-center gap-2 font-medium text-[#222] [&_del]:text-[#999]",
            featured ? "text-[clamp(16px,1.15vw,20px)]" : "text-[clamp(15px,1vw,18px)]",
          )}
        >
          {formatProductBoxPrice(product.salePrice)}
          {showOriginalPrice ? <del>{formatProductBoxPrice(product.price)}</del> : null}
        </h4>

        {variantSelection.hasSizes ? (
          <>
            <ProductVariantSelectors
              compact
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
              <p className="product-variant-selectors__error">
                {variantSelection.validationError}
              </p>
            ) : null}
          </>
        ) : null}

        <CartButton
          product={product}
          enableModal
          featured={featured}
          pushToBottom={fullHeight}
          cartVariation={variantSelection.cartVariation}
          validateBeforeAdd={variantSelection.hasSizes ? variantSelection.validate : undefined}
          requiresVariantSelection={variantSelection.hasSizes}
        />
      </div>
    </div>
  );
}
