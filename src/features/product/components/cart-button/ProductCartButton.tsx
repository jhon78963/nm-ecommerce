"use client";

import type { MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import type { SearchProduct } from "@/features/search/types/search.types";
import { cn } from "@/lib/utils";

import "./cart-button.css";

interface ProductCartButtonProps {
  product: SearchProduct | ProductBoxItem;
  variant?: ProductCartVariation;
  type?: "wishlist";
  className?: string;
}

export function ProductCartButton({
  product,
  variant,
  type = "wishlist",
  className,
}: ProductCartButtonProps) {
  const { addItem } = useCart();

  if (type !== "wishlist") {
    return null;
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if ("salePrice" in product) {
      addItem(productBoxItemToCartLineItem(product, 1, variant));
      return;
    }

    addItem(productBoxItemToCartLineItem(
      {
        id: product.id,
        slug: product.id,
        name: product.name,
        imageUrl: "/placeholder-product.svg",
        price: 0,
        salePrice: 0,
        discount: 0,
        ratingCount: null,
        reviewsCount: 0,
        stockStatus: "in_stock",
        sizes: product.sizes?.map((size) => ({
          id: size.id,
          label: size.size?.description ?? size.id,
          stock: size.stock,
          salePrice: size.salePrice,
          colors: (size.colors ?? []).map((color) => ({
            id: color.id,
            label: color.description,
            hex: "#CCCCCC",
            stock: 0,
          })),
        })),
      },
      1,
      variant,
    ));
  }

  return (
    <button
      type="button"
      className={cn("product-cart-button cart icon", className)}
      onClick={handleClick}
      aria-label={PRODUCT_COPY.addToCart}
      title={PRODUCT_COPY.addToCart}
    >
      <ShoppingCart aria-hidden="true" />
    </button>
  );
}
