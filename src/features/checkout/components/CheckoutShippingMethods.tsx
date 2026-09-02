"use client";

import { formatPrice } from "@/features/cart/utils/format-price";
import type { ShippingMethodOption } from "@/features/checkout/types/checkout.types";

interface CheckoutShippingMethodsProps {
  methods: ShippingMethodOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CheckoutShippingMethods({
  methods,
  selectedId,
  onSelect,
}: CheckoutShippingMethodsProps) {
  if (methods.length === 0) {
    return null;
  }

  return (
    <div className="summary-option-list">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`summary-option ${selectedId === method.id ? "is-selected" : ""}`}
        >
          <input
            type="radio"
            name="shipping_method"
            className="summary-option__radio"
            checked={selectedId === method.id}
            onChange={() => onSelect(method.id)}
          />
          <span className="summary-option__content">
            <span className="summary-option__title">{method.title}</span>
            {method.cost > 0 ? (
              <span className="summary-option__meta">{formatPrice(method.cost)}</span>
            ) : null}
          </span>
        </label>
      ))}
    </div>
  );
}
