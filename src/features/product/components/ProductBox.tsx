"use client";

import type { MouseEvent } from "react";
import { Heart, RefreshCw, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

import "./product-box.css";

interface ProductBoxProps {
  product: ProductBoxItem;
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
    <div className="product-box__stars">
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
      title="Add to Wishlist"
      className={cn("product-box__action product-box__action--wishlist", active && "text-theme")}
      onClick={(event) => {
        event.preventDefault();
        toggleItem(wishlistProduct);
      }}
    >
      <Heart className={cn(active && "fill-theme")} />
    </a>
  );
}

export function ProductBox({ product }: ProductBoxProps) {
  const href = getProductBoxHref(product);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const preventDefault = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  return (
    <div className={cn("product-box", isOutOfStock && "product-box--sold-out")}>
      <div className="product-box__media">
        {product.discount > 0 ? (
          <div className="product-box__ribbon">
            <span className="product-box__ribbon-shape" aria-hidden />
            {product.discount}%
          </div>
        ) : null}

        <div className="product-box__zoom">
          <Link href={href}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="product-box__image"
            />
          </Link>
        </div>

        <div className="product-box__cart-info">
          <WishlistIcon product={product} />

          <ul className="product-box__hover-action">
            <li />
            <li />
            <li>
              <a
                href="#"
                title="Quick View"
                className="product-box__action product-box__action--hover"
                onClick={preventDefault}
              >
                <Search />
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Compare"
                className="product-box__action product-box__action--hover"
                onClick={preventDefault}
              >
                <RefreshCw />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="product-box__body">
        <Link href={href} className="product-box__title">
          {product.name}
        </Link>

        <div className="product-box__rating-row">
          <ProductRating rating={product.ratingCount} />
          <span>({product.reviewsCount})</span>
        </div>

        <h4 className="product-box__price">
          {formatProductBoxPrice(product.salePrice)}
          {product.discount > 0 ? <del>{formatProductBoxPrice(product.price)}</del> : null}
        </h4>

        <button type="button" className="product-box__cart-btn">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
