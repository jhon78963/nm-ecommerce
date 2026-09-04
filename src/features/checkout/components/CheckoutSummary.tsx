"use client";

import Link from "next/link";

import { StoreImage } from "@/components/ui/StoreImage";
import { formatPrice } from "@/features/cart/utils/format-price";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { CheckoutPaymentMethods } from "@/features/checkout/components/CheckoutPaymentMethods";
import { CheckoutShippingMethods } from "@/features/checkout/components/CheckoutShippingMethods";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import type { ShippingZone } from "@/features/checkout/constants/peru-departments";
import type {
  CheckoutTotals,
  PaymentMethodOption,
  ShippingMethodOption,
} from "@/features/checkout/types/checkout.types";
import { ROUTES } from "@/lib/routes";

interface CheckoutSummaryProps {
  items: CartLineItem[];
  totals: CheckoutTotals;
  shippingMethods: ShippingMethodOption[];
  shippingZone: ShippingZone;
  shippingPostcode: string;
  paymentMethods: PaymentMethodOption[];
  shippingMethodId: string;
  paymentMethodId: string;
  couponCode: string;
  couponError: string | null;
  couponApplied: boolean;
  isApplyingCoupon?: boolean;
  isAuthenticated?: boolean;
  isSubmitting: boolean;
  onShippingMethodChange: (id: string) => void;
  onPaymentMethodChange: (id: string) => void;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onSubmit: () => void;
}

export function CheckoutSummary({
  items,
  totals,
  shippingMethods,
  shippingZone,
  shippingPostcode,
  paymentMethods,
  shippingMethodId,
  paymentMethodId,
  couponCode,
  couponError,
  couponApplied,
  isApplyingCoupon = false,
  isAuthenticated = false,
  isSubmitting,
  onShippingMethodChange,
  onPaymentMethodChange,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onSubmit,
}: CheckoutSummaryProps) {
  const shippingZoneLabel =
    shippingZone === "trujillo"
      ? CHECKOUT_COPY.shippingZoneTrujillo
      : shippingZone === "la-libertad"
        ? CHECKOUT_COPY.shippingZoneLaLibertad
        : CHECKOUT_COPY.shippingZoneNational;

  return (
    <div className="checkout-right-box">
      <div className="order-box">
        <div className="title-box">
          <h4>{CHECKOUT_COPY.summaryTitle}</h4>
          <p>{CHECKOUT_COPY.summarySubtitle}</p>
        </div>

        <ul className="checkout-qty-list">
          {items.map((item) => (
            <li key={item.id}>
              <div className="cart-image">
                <StoreImage
                  src={item.imageUrl}
                  alt={item.name}
                  width={72}
                  height={72}
                  className="checkout-product-image"
                />
              </div>
              <div className="cart-content">
                <div>
                  <h4>{item.name}</h4>
                  {item.variation ? <p className="variation">{item.variation}</p> : null}
                  <h5>
                    {formatPrice(item.price)} × {item.quantity}
                  </h5>
                </div>
                <span className="line-total">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-box order-box--payment">
        <div className="title-box">
          <h4>{CHECKOUT_COPY.billingSummary}</h4>
        </div>

        <div className="coupon-block">
          <label htmlFor="checkout-coupon" className="coupon-label">
            {CHECKOUT_COPY.couponLabel}
          </label>
          <div className="coupon-input-box">
            <input
              id="checkout-coupon"
              type="text"
              className={`form-control ${couponError ? "is-invalid" : ""}`}
              placeholder={CHECKOUT_COPY.couponPlaceholder}
              value={couponCode}
              onChange={(event) => onCouponCodeChange(event.target.value)}
              disabled={couponApplied}
            />
            {couponApplied ? (
              <button type="button" className="apply-button" onClick={onRemoveCoupon}>
                {CHECKOUT_COPY.removeCoupon}
              </button>
            ) : (
              <button
                type="button"
                className="apply-button"
                onClick={onApplyCoupon}
                disabled={isApplyingCoupon}
              >
                {isApplyingCoupon ? "Validando..." : CHECKOUT_COPY.applyCoupon}
              </button>
            )}
          </div>
          {couponError ? <p className="coupon-error">{couponError}</p> : null}
          {!isAuthenticated && !couponApplied ? (
            <p className="coupon-hint">{CHECKOUT_COPY.couponAccountHint}</p>
          ) : null}
          {couponApplied ? <p className="coupon-success">{CHECKOUT_COPY.couponApplied}</p> : null}
        </div>

        <ul className="sub-total">
          <li>
            {CHECKOUT_COPY.subtotal}
            <span className="count">{formatPrice(totals.subtotal)}</span>
          </li>
          {totals.couponDiscount > 0 ? (
            <li>
              {CHECKOUT_COPY.couponDiscount}
              <span className="count">-{formatPrice(totals.couponDiscount)}</span>
            </li>
          ) : null}
        </ul>

        <div className="summary-section">
          <h5 className="summary-section__title">{CHECKOUT_COPY.shipping}</h5>
          {shippingPostcode.trim() ? (
            <p className="shipping-zone-label">{shippingZoneLabel}</p>
          ) : (
            <p className="shipping-zone-hint">{CHECKOUT_COPY.shippingZoneHint}</p>
          )}
          <CheckoutShippingMethods
            methods={shippingMethods}
            selectedId={shippingMethodId}
            onSelect={onShippingMethodChange}
          />
        </div>

        <ul className="total">
          <li>
            {CHECKOUT_COPY.total}
            <span className="count">{formatPrice(totals.total)}</span>
          </li>
        </ul>

        <p className="tax-note">{CHECKOUT_COPY.taxIncluded}</p>

        <div className="summary-section">
          <h5 className="summary-section__title">{CHECKOUT_COPY.paymentMode}</h5>
          <CheckoutPaymentMethods
            methods={paymentMethods}
            selectedId={paymentMethodId}
            onSelect={onPaymentMethodChange}
          />
        </div>

        <p className="privacy-note">
          {CHECKOUT_COPY.privacyNotice}{" "}
          <Link href={ROUTES.institutional.privacidad}>{CHECKOUT_COPY.privacyLink}</Link>.
        </p>

        <button
          type="button"
          className="order-btn btn"
          disabled={isSubmitting || items.length === 0}
          onClick={onSubmit}
        >
          {isSubmitting ? CHECKOUT_COPY.processing : CHECKOUT_COPY.placeOrder}
        </button>
      </div>
    </div>
  );
}
