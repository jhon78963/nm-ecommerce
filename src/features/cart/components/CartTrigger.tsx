"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { cn } from "@/lib/utils";

export function CartTrigger() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex cursor-pointer items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      {itemCount > 0 ? (
        <span
          className={cn(
            "cart_qty_cls absolute -right-2 top-[20%] flex items-center justify-center",
            "rounded-full bg-theme font-semibold text-white",
            "size-[clamp(16px,1.2vw,20px)] text-[clamp(10px,0.8vw,12px)] leading-none",
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
