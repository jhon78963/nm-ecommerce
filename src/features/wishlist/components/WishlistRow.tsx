"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

import { ProductCartButton } from "@/features/product/components/cart-button/ProductCartButton";

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
      <td>
        <Link href={href} className="product-image-link">
          <Image
            src="/placeholder-product.svg"
            alt={product.name}
            width={90}
            height={90}
            className="wishlist-product-image"
          />
        </Link>
      </td>

      <td>
        <Link href={href} className="name">
          {product.name}
        </Link>

        <div className="mobile-cart-content">
          <div className="col">
            <p>{getStockStatusLabel(stockStatus)}</p>
          </div>
          <div className="col">
            <h2 className="td-color">{formatProductPrice(product)}</h2>
          </div>
          <div className="col">
            <div className="remove-icon-box">
              <h2 className="td-color">
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="icon"
                  aria-label={`Quitar ${product.name} de favoritos`}
                >
                  <X className="size-4" />
                </button>
                {isInStock ? <ProductCartButton product={product} /> : null}
              </h2>
            </div>
          </div>
        </div>
      </td>

      <td>
        <div className="table-price">
          <h2>{formatProductPrice(product)}</h2>
        </div>
      </td>

      <td>
        <p>{getStockStatusLabel(stockStatus)}</p>
      </td>

      <td>
        <div className="icon-box">
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="icon"
            aria-label={`Quitar ${product.name} de favoritos`}
          >
            <X className="size-4" />
          </button>
          {isInStock ? <ProductCartButton product={product} /> : null}
        </div>
      </td>
    </tr>
  );
}
