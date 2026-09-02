"use client";

import type { MouseEvent } from "react";
import { Heart, RefreshCw, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
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

function ProductRating({ rating }: { rating: number | null }) {
  const value = rating ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = value >= index + 1;

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
        "group relative border border-[#f1f1f1] p-[clamp(7px,0.8vw,12px)] transition-all duration-500 ease-in-out",
        fullHeight && "flex h-full flex-col",
        featured && "product-box-featured",
      )}
    >
      <div className="relative z-0 overflow-hidden bg-[#f8f8f8]">
        {product.discount > 0 ? (
          <div className="product-box__discount absolute top-2.5 left-2.5 z-[1] grid aspect-square w-fit place-content-center p-2.5 text-[clamp(10px,0.9vw,14px)] font-bold text-white">
            <span className="product-box__ribbon-shape" aria-hidden />
            {product.discount}%
          </div>
        ) : null}

        <div className="group/zoom overflow-hidden">
          <Link href={href}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className={cn(
                "product-box__image block aspect-square w-full object-contain transition-transform duration-500 ease-in-out group-hover/zoom:scale-110",
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
              <a href="#" title={PRODUCT_COPY.quickView} className={hoverActionClass} onClick={preventDefault}>
                <Search />
              </a>
            </li>
            <li>
              <a href="#" title={PRODUCT_COPY.compare} className={hoverActionClass} onClick={preventDefault}>
                <RefreshCw />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={cn("mt-[15px]", fullHeight && "flex flex-1 flex-col", featured && "mt-[18px]")}>
        <Link
          href={href}
          className={cn(
            "product-box__title mb-1.5 block truncate leading-none font-medium text-[#222] capitalize no-underline transition-colors duration-500 hover:text-theme",
            featured
              ? "text-[clamp(17px,1.25vw,20px)]"
              : "text-[clamp(16px,1.1vw,18px)]",
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
          {product.discount > 0 ? <del>{formatProductBoxPrice(product.price)}</del> : null}
        </h4>

        <button
          type="button"
          className={cn(
            "product-box__cta mt-2.5 block w-full cursor-pointer border-none bg-[#f6f6f6] text-center font-medium text-[#888] transition-all duration-300 hover:bg-theme hover:text-white max-md:mt-2",
            featured
              ? "p-[clamp(8px,0.75vw,12px)] text-[clamp(15px,1.05vw,17px)]"
              : "p-[clamp(5px,0.6vw,10px)] text-[clamp(14px,1vw,16px)]",
            fullHeight && "mt-auto",
          )}
        >
          {PRODUCT_COPY.addToCart}
        </button>
      </div>
    </div>
  );
}
