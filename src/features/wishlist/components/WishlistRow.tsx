"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

import { ProductCartButton } from "@/features/product/components/cart-button/ProductCartButton";
import { formatProductBoxPrice, getProductBoxHref } from "@/features/product/utils/format-product-price";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import { buildProductHrefWithVariants } from "@/features/product/utils/product-variant-url";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";
import {
  getStockStatusLabel,
  getWishlistItemStockStatus,
} from "@/features/wishlist/utils/product-stock";

interface WishlistRowProps {
  storedItem: WishlistStoredItem;
  product: ProductBoxItem;
}

export function WishlistRow({ storedItem, product }: WishlistRowProps) {
  const { removeItem } = useWishlist();
  const enrichedProduct = enrichProductWithVariants(product);
  const variant = {
    productSizeId: storedItem.productSizeId,
    colorId: storedItem.colorId,
    variation: storedItem.variation,
  };
  const href = buildProductHrefWithVariants(getProductBoxHref(product), {
    sizeId: storedItem.productSizeId,
    colorId: storedItem.colorId,
  });
  const stockStatus = getWishlistItemStockStatus(enrichedProduct.sizes, variant);
  const isInStock = stockStatus === "in_stock";

  return (
    <tr>
      <td>
        <Link href={href} className="product-image-link">
          <Image
            src={product.imageUrl || "/placeholder-product.svg"}
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
        {storedItem.variation ? (
          <p className="mt-1 text-sm text-[#777]">{storedItem.variation}</p>
        ) : null}

        <div className="mobile-cart-content">
          <div className="col">
            <p>{getStockStatusLabel(stockStatus)}</p>
          </div>
          <div className="col">
            <h2 className="td-color">{formatProductBoxPrice(product.salePrice)}</h2>
          </div>
          <div className="col">
            <div className="remove-icon-box">
              <h2 className="td-color">
                <button
                  type="button"
                  onClick={() => removeItem(storedItem.productId)}
                  className="icon"
                  aria-label={`Quitar ${product.name} de favoritos`}
                >
                  <X className="size-4" />
                </button>
                {isInStock ? <ProductCartButton product={product} variant={variant} /> : null}
              </h2>
            </div>
          </div>
        </div>
      </td>

      <td>
        <div className="table-price">
          <h2>{formatProductBoxPrice(product.salePrice)}</h2>
        </div>
      </td>

      <td>
        <p>{getStockStatusLabel(stockStatus)}</p>
      </td>

      <td>
        <div className="icon-box">
          <button
            type="button"
            onClick={() => removeItem(storedItem.productId)}
            className="icon"
            aria-label={`Quitar ${product.name} de favoritos`}
          >
            <X className="size-4" />
          </button>
          {isInStock ? <ProductCartButton product={product} variant={variant} /> : null}
        </div>
      </td>
    </tr>
  );
}
