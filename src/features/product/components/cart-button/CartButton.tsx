"use client";

import type { MouseEvent } from "react";
import { Minus, ShoppingCart, Trash2 } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { CART_BUTTON_COPY } from "@/features/product/constants/cart-button-copy";
import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { useProductCartItem } from "@/features/product/hooks/use-product-cart-item";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import { cn } from "@/lib/utils";

import "./cart-button.css";

type CartButtonMode = "cta" | "quantity" | "icon";

interface CartButtonProps {
  product: ProductBoxItem;
  text?: string;
  className?: string;
  mode?: CartButtonMode;
  /** Reserved for classified products (opens modal). Currently adds directly to cart. */
  enableModal?: boolean;
  featured?: boolean;
  pushToBottom?: boolean;
}

export function CartButton({
  product,
  text = PRODUCT_COPY.addToCart,
  className,
  mode = "cta",
  enableModal: _enableModal = false,
  featured = false,
  pushToBottom = false,
}: CartButtonProps) {
  const { addItem, updateQuantity } = useCart();
  const cartItem = useProductCartItem(String(product.id));
  const isInStock = product.stockStatus === "in_stock";
  const isInCart = Boolean(cartItem && cartItem.quantity > 0);

  function handleAddToCart(event?: MouseEvent) {
    event?.preventDefault();

    if (!isInStock) {
      return;
    }

    addItem(productBoxItemToCartLineItem(product, 1));
  }

  function handleQuantityChange(delta: number) {
    if (!cartItem) {
      return;
    }

    updateQuantity(cartItem.id, cartItem.quantity + delta);
  }

  if (!isInStock) {
    if (mode === "icon") {
      return (
        <button
          type="button"
          className={cn("cart-button-icon", className)}
          disabled
          aria-label={CART_BUTTON_COPY.outOfStock}
        >
          <ShoppingCart aria-hidden="true" />
        </button>
      );
    }

    return (
      <button
        type="button"
        className={cn(
          mode === "cta" && "add-cart-btn",
          mode === "quantity" && "add-button add_cart",
          featured && mode === "cta" && "add-cart-btn--featured",
          pushToBottom && mode === "cta" && "add-cart-btn--auto-top",
          className,
        )}
        disabled
      >
        {CART_BUTTON_COPY.outOfStock}
      </button>
    );
  }

  if (mode === "quantity") {
    return (
      <div className="addtocart_btn">
        {!isInCart ? (
          <button
            type="button"
            id={`add-to-cart-${product.id}`}
            className={cn("add-button add_cart", className)}
            onClick={handleAddToCart}
          >
            {text}
          </button>
        ) : null}

        {cartItem && cartItem.quantity > 0 ? (
          <div className={cn("qty-box", isInCart && "open")}>
            <div className="input-group">
              <button
                type="button"
                className="btn quantity-left-minus"
                onClick={() => handleQuantityChange(-1)}
                aria-label={cartItem.quantity > 1 ? "Disminuir cantidad" : "Eliminar del carrito"}
              >
                {cartItem.quantity > 1 ? (
                  <Minus className="size-4" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
              </button>

              <input
                type="text"
                name="quantity"
                className="form-control input-number qty-input"
                value={cartItem.quantity}
                readOnly
                aria-label="Cantidad en carrito"
              />

              <button
                type="button"
                className="btn quantity-right-plus"
                onClick={() => handleQuantityChange(1)}
                aria-label="Aumentar cantidad"
              >
                <span className="sr-only">Aumentar</span>+
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (mode === "icon") {
    return (
      <button
        type="button"
        className={cn("cart-button-icon", isInCart && "active", className)}
        onClick={handleAddToCart}
        aria-label={isInCart ? CART_BUTTON_COPY.added : text}
        title={isInCart ? CART_BUTTON_COPY.added : text}
      >
        <ShoppingCart aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      id={`add-to-cart-${product.id}`}
      className={cn(
        "add-cart-btn",
        isInCart && "active",
        featured && "add-cart-btn--featured",
        pushToBottom && "add-cart-btn--auto-top",
        className,
      )}
      onClick={handleAddToCart}
    >
      {isInCart ? CART_BUTTON_COPY.added : text}
    </button>
  );
}
