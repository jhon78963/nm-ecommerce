"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";

import { formatProductPrice, getProductHref } from "@/features/search/utils/product";
import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import {
  getProductStockStatus,
  getStockStatusLabel,
} from "@/features/wishlist/utils/product-stock";

interface WishlistRowProps {
  product: SearchProduct;
}

export function WishlistRow({ product }: WishlistRowProps) {
  const { removeItem } = useWishlist();
  const href = getProductHref(product);
  const stockStatus = getProductStockStatus(product);
  const isInStock = stockStatus === "in_stock";

  return (
    <tr>
      <td className="border-b border-[#eee] px-3 py-4 text-center align-middle">
        <Link href={href} className="inline-block">
          <Image
            src="/placeholder-product.svg"
            alt={product.name}
            width={90}
            height={90}
            className="mx-auto size-[clamp(70px,8vw,90px)] object-contain"
          />
        </Link>
      </td>

      <td className="border-b border-[#eee] px-3 py-4 align-middle">
        <Link href={href} className="name text-base font-medium text-[#222] hover:text-theme">
          {product.name}
        </Link>

        <div className="mobile-cart-content mt-3 grid gap-3 md:hidden">
          <p className="text-sm text-[#777]">{getStockStatusLabel(stockStatus)}</p>
          <h2 className="td-color text-base font-semibold text-[#222]">{formatProductPrice(product)}</h2>
          <div className="remove-icon-box">
            <div className="td-color flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="icon flex size-8 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#777] hover:text-theme"
                aria-label={`Quitar ${product.name} de favoritos`}
              >
                <X className="size-4" />
              </button>
              {isInStock ? (
                <Link
                  href={href}
                  className="icon flex size-8 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#777] hover:text-theme"
                  aria-label={`Ver ${product.name}`}
                >
                  <ShoppingBag className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </td>

      <td className="hidden border-b border-[#eee] px-3 py-4 text-center align-middle md:table-cell">
        <h2 className="text-base font-semibold text-[#222]">{formatProductPrice(product)}</h2>
      </td>

      <td className="hidden border-b border-[#eee] px-3 py-4 text-center align-middle md:table-cell">
        <p className="text-sm text-[#777]">{getStockStatusLabel(stockStatus)}</p>
      </td>

      <td className="hidden border-b border-[#eee] px-3 py-4 align-middle md:table-cell">
        <div className="icon-box flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="icon flex size-8 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#777] hover:text-theme"
            aria-label={`Quitar ${product.name} de favoritos`}
          >
            <X className="size-4" />
          </button>
          {isInStock ? (
            <Link
              href={href}
              className="icon flex size-8 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#777] hover:text-theme"
              aria-label={`Ver ${product.name}`}
            >
              <ShoppingBag className="size-4" />
            </Link>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
