"use client";

import type { MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { searchProductToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import type { SearchProduct } from "@/features/search/types/search.types";
import { cn } from "@/lib/utils";

import "./cart-button.css";

interface ProductCartButtonProps {
  product: SearchProduct;
  type?: "wishlist";
  className?: string;
}

export function ProductCartButton({ product, type = "wishlist", className }: ProductCartButtonProps) {
  const { addItem } = useCart();

  if (type !== "wishlist") {
    return null;
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    addItem(searchProductToCartLineItem(product, 1));
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
