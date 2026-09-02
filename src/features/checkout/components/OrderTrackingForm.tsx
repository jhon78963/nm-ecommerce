"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import {
  getOrderApiErrorMessage,
  trackOrder,
} from "@/features/checkout/services/order.service";
import { ROUTES } from "@/lib/routes";

import "./order.css";

export function OrderTrackingForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderNumber.trim() || !emailOrPhone.trim()) {
      setError(CHECKOUT_COPY.requiredField);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await trackOrder(orderNumber, emailOrPhone);
      router.push(
        `${ROUTES.orderDetails}?order_number=${encodeURIComponent(order.orderNumber)}&email_or_phone=${encodeURIComponent(emailOrPhone)}`,
      );
    } catch (submitError) {
      setError(getOrderApiErrorMessage(submitError));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-search-content">
      <h3>{CHECKOUT_COPY.trackingPageTitle}</h3>
      <p>{CHECKOUT_COPY.trackingPageDescription}</p>

      <form className="input-box" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="order_number">{CHECKOUT_COPY.orderNumber}</label>
          <input
            id="order_number"
            className="form-control"
            value={orderNumber}
            onChange={(event) => {
              setOrderNumber(event.target.value);
              setError(null);
            }}
            placeholder="NM-20260202-1234"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email_or_phone">{CHECKOUT_COPY.emailOrPhone}</label>
          <input
            id="email_or_phone"
            className="form-control"
            value={emailOrPhone}
            onChange={(event) => {
              setEmailOrPhone(event.target.value);
              setError(null);
            }}
            placeholder="correo@ejemplo.com"
          />
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
          {isSubmitting ? "Buscando..." : CHECKOUT_COPY.track}
        </button>
      </form>
    </div>
  );
}
