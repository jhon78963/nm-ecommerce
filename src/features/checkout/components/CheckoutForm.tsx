"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/features/cart/context/CartProvider";
import { cartLineHasValidVariant } from "@/features/cart/utils/cart-variant";
import { CheckoutAddressFields } from "@/features/checkout/components/CheckoutAddressFields";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { PAYMENT_METHODS } from "@/features/checkout/constants/payment-methods";
import { isTrujilloZone, resolveShippingZone } from "@/features/checkout/constants/peru-departments";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";
import { createEmptyAddress } from "@/features/checkout/utils/address";
import {
  calculateCheckoutTotals,
  getShippingMethodById,
  getShippingMethodsForZone,
  validateCoupon,
} from "@/features/checkout/utils/checkout-totals";
import {
  buildCreateOrderPayload,
  createOrder,
  getOrderApiErrorMessage,
} from "@/features/checkout/services/order.service";
import {
  clearCheckoutDraftFromStorage,
  readCheckoutDraftFromStorage,
  writeCheckoutDraftToStorage,
} from "@/features/checkout/utils/checkout-storage";
import { ROUTES } from "@/lib/routes";

import "./checkout.css";

type FormErrors = Record<string, string | undefined>;

function validateAddress(address: CheckoutAddress, prefix: string): FormErrors {
  const errors: FormErrors = {};

  if (!address.firstName.trim()) errors[`${prefix}.firstName`] = CHECKOUT_COPY.requiredField;
  if (!address.lastName.trim()) errors[`${prefix}.lastName`] = CHECKOUT_COPY.requiredField;
  if (!address.address1.trim()) errors[`${prefix}.address1`] = CHECKOUT_COPY.requiredField;
  if (!address.city.trim()) errors[`${prefix}.city`] = CHECKOUT_COPY.requiredField;
  if (!address.state.trim()) errors[`${prefix}.state`] = CHECKOUT_COPY.requiredField;
  if (!address.postcode.trim()) errors[`${prefix}.postcode`] = CHECKOUT_COPY.requiredField;

  return errors;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return CHECKOUT_COPY.requiredField;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return CHECKOUT_COPY.invalidEmail;
  return undefined;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, isHydrated, clearCart } = useCart();

  const [billing, setBilling] = useState<CheckoutAddress>(createEmptyAddress);
  const [shipping, setShipping] = useState<CheckoutAddress>(createEmptyAddress);
  const [email, setEmail] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingMethodId, setShippingMethodId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("culqi");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormHydrated, setIsFormHydrated] = useState(false);
  const isCompletingOrderRef = useRef(false);

  const shippingZone = resolveShippingZone(
    (sameAsBilling ? billing : shipping).postcode,
    (sameAsBilling ? billing : shipping).state,
  );
  const isTrujillo = isTrujilloZone(
    (sameAsBilling ? billing : shipping).postcode,
    (sameAsBilling ? billing : shipping).state,
  );
  const shippingMethods = useMemo(
    () => getShippingMethodsForZone(shippingZone),
    [shippingZone],
  );
  const paymentMethods = useMemo(
    () => PAYMENT_METHODS.filter((method) => !method.trujilloOnly || isTrujillo),
    [isTrujillo],
  );

  const selectedShipping = getShippingMethodById(shippingMethodId, shippingZone);
  const shippingCost = selectedShipping?.cost ?? 0;

  const totals = calculateCheckoutTotals(items, shippingCost, couponDiscount);

  useEffect(() => {
    const draft = readCheckoutDraftFromStorage();
    if (draft) {
      setBilling(draft.billing);
      setShipping(draft.shipping);
      setEmail(draft.email);
      setOrderNotes(draft.orderNotes);
      setSameAsBilling(draft.sameAsBilling);
      setShippingMethodId(draft.shippingMethodId);
      setPaymentMethodId(draft.paymentMethodId);
      setCouponCode(draft.couponCode);
      setAppliedCouponCode(draft.appliedCouponCode);
      setCouponDiscount(draft.couponDiscount);
    }
    setIsFormHydrated(true);
  }, []);

  useEffect(() => {
    if (!isFormHydrated || isCompletingOrderRef.current) return;

    writeCheckoutDraftToStorage({
      billing,
      shipping,
      email,
      orderNotes,
      sameAsBilling,
      shippingMethodId,
      paymentMethodId,
      couponCode,
      appliedCouponCode,
      couponDiscount,
    });
  }, [
    billing,
    shipping,
    email,
    orderNotes,
    sameAsBilling,
    shippingMethodId,
    paymentMethodId,
    couponCode,
    appliedCouponCode,
    couponDiscount,
    isFormHydrated,
  ]);

  useEffect(() => {
    if (!isHydrated || isCompletingOrderRef.current) return;
    if (items.length === 0) {
      router.replace(ROUTES.cart);
    }
  }, [isHydrated, items.length, router]);

  useEffect(() => {
    if (!shippingMethods.some((method) => method.id === shippingMethodId)) {
      setShippingMethodId(shippingMethods[0]?.id ?? "");
    }
  }, [shippingMethods, shippingMethodId]);

  useEffect(() => {
    if (!paymentMethods.some((method) => method.id === paymentMethodId)) {
      setPaymentMethodId(paymentMethods[0]?.id ?? "culqi");
    }
  }, [paymentMethods, paymentMethodId]);

  const handleBillingChange = (field: keyof CheckoutAddress, value: string) => {
    setBilling((current) => {
      const next = { ...current, [field]: value };
      if (sameAsBilling) {
        setShipping(next);
      }
      return next;
    });
  };

  const handleShippingChange = (field: keyof CheckoutAddress, value: string) => {
    setShipping((current) => ({ ...current, [field]: value }));
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setShipping({ ...billing });
      setErrors((current) => {
        const next = { ...current };
        for (const key of Object.keys(next)) {
          if (key.startsWith("shipping.")) {
            delete next[key];
          }
        }
        return next;
      });
    }
  };

  const handleApplyCoupon = () => {
    const discount = validateCoupon(couponCode);
    if (discount < 0) {
      setCouponError(CHECKOUT_COPY.couponInvalid);
      setAppliedCouponCode("");
      setCouponDiscount(0);
      return;
    }

    setCouponError(null);
    setAppliedCouponCode(couponCode.trim().toUpperCase());
    setCouponDiscount(discount);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCouponCode("");
    setCouponDiscount(0);
    setCouponError(null);
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {
      ...validateAddress(billing, "billing"),
      ...(sameAsBilling ? {} : validateAddress(shipping, "shipping")),
      email: validateEmail(email),
    };

    if (!shippingMethodId) nextErrors.shippingMethod = CHECKOUT_COPY.requiredField;
    if (!paymentMethodId) nextErrors.paymentMethod = CHECKOUT_COPY.requiredField;

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm() || items.length === 0) return;

    const missingVariant = items.some((item) => !cartLineHasValidVariant(item));
    if (missingVariant) {
      setSubmitError(CHECKOUT_COPY.invalidCartVariant);
      return;
    }

    const shippingMethod = getShippingMethodById(shippingMethodId, shippingZone);
    const paymentMethod = paymentMethods.find((method) => method.id === paymentMethodId);

    if (!shippingMethod || !paymentMethod) {
      return;
    }

    isCompletingOrderRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildCreateOrderPayload(
        email,
        billing,
        sameAsBilling ? billing : shipping,
        sameAsBilling,
        orderNotes,
        shippingMethod.id,
        paymentMethod.id,
        appliedCouponCode,
        items,
      );

      const order = await createOrder(payload);

      clearCheckoutDraftFromStorage();
      clearCart();
      router.replace(
        `${ROUTES.orderConfirmation}?order_number=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.email)}`,
      );
    } catch (error) {
      isCompletingOrderRef.current = false;
      setIsSubmitting(false);
      setSubmitError(getOrderApiErrorMessage(error));
    }
  };

  if (!isHydrated || !isFormHydrated) {
    return null;
  }

  const billingFieldErrors = {
    firstName: errors["billing.firstName"],
    lastName: errors["billing.lastName"],
    address1: errors["billing.address1"],
    city: errors["billing.city"],
    state: errors["billing.state"],
    postcode: errors["billing.postcode"],
  };

  const shippingFieldErrors = {
    firstName: errors["shipping.firstName"],
    lastName: errors["shipping.lastName"],
    address1: errors["shipping.address1"],
    city: errors["shipping.city"],
    state: errors["shipping.state"],
    postcode: errors["shipping.postcode"],
  };

  return (
    <div className="checkout-page">
      <div className="row g-4">
        <div className="col-left">
          <div className="left-sidebar-checkout">
            <div className="checkout-detail-box">
              <section className="checkbox-main-box">
                <div className="checkout-step-header">
                  <span className="checkout-step-number">1</span>
                  <div>
                    <h2>{CHECKOUT_COPY.stepBillingTitle}</h2>
                    <p>{CHECKOUT_COPY.stepBillingSubtitle}</p>
                  </div>
                </div>

                <div className="checkout-form-section">
                  <div className="mb-4">
                    <label htmlFor="checkout-email" className="form-label mb-1 block text-sm font-medium text-[#777]">
                      {CHECKOUT_COPY.email} *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      className="form-control w-full border border-[#eee] bg-white px-3 py-2.5 text-sm"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                    {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
                  </div>

                  <CheckoutAddressFields
                    prefix="billing"
                    address={billing}
                    errors={billingFieldErrors}
                    onChange={handleBillingChange}
                  />
                </div>
              </section>

              <section className="checkbox-main-box">
                <div className="checkout-step-header">
                  <span className="checkout-step-number">2</span>
                  <div>
                    <h2>{CHECKOUT_COPY.stepShippingTitle}</h2>
                    <p>{CHECKOUT_COPY.stepShippingSubtitle}</p>
                  </div>
                </div>

                <label className="checkout-same-address">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(event) => handleSameAsBillingChange(event.target.checked)}
                  />
                  <span>{CHECKOUT_COPY.sameAsBilling}</span>
                </label>

                {!sameAsBilling ? (
                  <CheckoutAddressFields
                    prefix="shipping"
                    address={shipping}
                    errors={shippingFieldErrors}
                    onChange={handleShippingChange}
                  />
                ) : null}
              </section>

              <section className="checkbox-main-box">
                <div className="checkout-step-header">
                  <span className="checkout-step-number">3</span>
                  <div>
                    <h2>{CHECKOUT_COPY.stepNotesTitle}</h2>
                    <p>{CHECKOUT_COPY.stepNotesSubtitle}</p>
                  </div>
                </div>

                <textarea
                  className="form-control w-full border border-[#eee] bg-white px-3 py-2.5 text-sm"
                  rows={4}
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder={CHECKOUT_COPY.orderNotes}
                />
              </section>
            </div>
          </div>
        </div>

        <div className="col-right">
          {submitError ? <p className="form-error mb-4">{submitError}</p> : null}
          <CheckoutSummary
            items={items}
            totals={totals}
            shippingMethods={shippingMethods}
            shippingZone={shippingZone}
            shippingPostcode={(sameAsBilling ? billing : shipping).postcode}
            paymentMethods={paymentMethods}
            shippingMethodId={shippingMethodId}
            paymentMethodId={paymentMethodId}
            couponCode={couponCode}
            couponError={couponError}
            couponApplied={Boolean(appliedCouponCode)}
            isSubmitting={isSubmitting}
            onShippingMethodChange={setShippingMethodId}
            onPaymentMethodChange={setPaymentMethodId}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
