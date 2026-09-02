"use client";

import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import type { PaymentMethodOption } from "@/features/checkout/types/checkout.types";

interface CheckoutPaymentMethodsProps {
  methods: PaymentMethodOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CheckoutPaymentMethods({
  methods,
  selectedId,
  onSelect,
}: CheckoutPaymentMethodsProps) {
  return (
    <div className="summary-option-list">
      {methods.map((method) => (
        <div key={method.id} className="summary-payment-item">
          <label
            className={`summary-option summary-option--payment ${selectedId === method.id ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name="payment_method"
              className="summary-option__radio"
              checked={selectedId === method.id}
              onChange={() => onSelect(method.id)}
            />
            <span className="summary-option__content">
              <span className="summary-option__title">{method.title}</span>
            </span>
          </label>

          {selectedId === method.id && method.id === "culqi" ? (
            <p className="summary-option__hint">{CHECKOUT_COPY.culqiInfo}</p>
          ) : null}

          {selectedId === method.id && method.id === "bacs" ? (
            <p className="summary-option__hint">{CHECKOUT_COPY.bacsInstructions}</p>
          ) : null}

          {selectedId === method.id && method.id === "cod" ? (
            <p className="summary-option__hint">{method.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
