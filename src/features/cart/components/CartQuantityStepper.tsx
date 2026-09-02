"use client";

import { Minus, Plus } from "lucide-react";

import { CART_COPY } from "@/features/cart/constants/cart-copy";

interface CartQuantityStepperProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  compact?: boolean;
}

export function CartQuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  compact = false,
}: CartQuantityStepperProps) {
  return (
    <div className={compact ? "cart-qty-box cart-qty-box--compact" : "cart-qty-box"}>
      <button
        type="button"
        onClick={onDecrease}
        aria-label={CART_COPY.decreaseQuantity}
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={CART_COPY.increaseQuantity}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
