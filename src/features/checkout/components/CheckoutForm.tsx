"use client";

import { useEffect, useMemo, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/features/cart/context/CartProvider";
import { trackBeginCheckout } from "@/features/analytics";
import { fetchCustomerAddresses } from "@/features/account/services/account-addresses.service";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { cartLineHasValidVariant } from "@/features/cart/utils/cart-variant";
import { CheckoutAddressFields } from "@/features/checkout/components/CheckoutAddressFields";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { PAYMENT_METHODS } from "@/features/checkout/constants/payment-methods";
import { isTrujilloZone, resolveShippingZone } from "@/features/checkout/constants/peru-departments";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";
import type { StoredOrder } from "@/features/checkout/types/order.types";
import { createEmptyAddress } from "@/features/checkout/utils/address";
import {
  addressPrefillChanged,
  buildCheckoutPrefillFromCustomer,
  mergeAddressPrefill,
} from "@/features/checkout/utils/checkout-customer-prefill";
import {
  calculateCheckoutTotals,
  getShippingMethodById,
  getShippingMethodsForZone,
} from "@/features/checkout/utils/checkout-totals";
import { validateCheckoutCoupon } from "@/features/checkout/services/coupon.service";
import {
  buildCreateOrderPayload,
  cancelCheckoutOrder,
  createOrder,
  getOrderApiErrorMessage,
  prepareCulqiCheckout,
} from "@/features/checkout/services/order.service";
import {
  clearCheckoutDraftFromStorage,
  readCheckoutDraftFromStorage,
  writeCheckoutDraftToStorage,
} from "@/features/checkout/utils/checkout-storage";
import {
  clearCulqiPendingCharge,
  storeCulqiPendingCharge,
} from "@/features/checkout/utils/culqi-pending-charge";
import { saveOrder } from "@/features/checkout/utils/order-storage";
import { ROUTES } from "@/lib/routes";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/constants";
import { executeRecaptcha } from "@/lib/recaptcha/client";
import { isCulqiConfigured, openCulqiCheckout } from "@/lib/culqi/client";

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

function buildInitialCheckoutState() {
  const draft = readCheckoutDraftFromStorage();

  return {
    billing: draft?.billing ?? createEmptyAddress(),
    shipping: draft?.shipping ?? createEmptyAddress(),
    email: draft?.email ?? "",
    orderNotes: draft?.orderNotes ?? "",
    sameAsBilling: draft?.sameAsBilling ?? true,
    shippingMethodId: draft?.shippingMethodId ?? "",
    paymentMethodId: draft?.paymentMethodId ?? "bacs",
    couponCode: draft?.couponCode ?? "",
    appliedCouponCode: draft?.appliedCouponCode ?? "",
    couponDiscount: draft?.couponDiscount ?? 0,
  };
}

export function CheckoutForm() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">Cargando checkout…</div>
      </div>
    );
  }

  return <CheckoutFormClient />;
}

function CheckoutFormClient() {
  const initialState = useMemo(() => buildInitialCheckoutState(), []);
  const router = useRouter();
  const { items, isHydrated, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: isAuthLoading, openLogin } = useAuth();

  const [billing, setBilling] = useState(initialState.billing);
  const [shipping, setShipping] = useState(initialState.shipping);
  const [email, setEmail] = useState(initialState.email);
  const [orderNotes, setOrderNotes] = useState(initialState.orderNotes);
  const [sameAsBilling, setSameAsBilling] = useState(initialState.sameAsBilling);
  const [shippingMethodId, setShippingMethodId] = useState(initialState.shippingMethodId);
  const [paymentMethodId, setPaymentMethodId] = useState(initialState.paymentMethodId);
  const [couponCode, setCouponCode] = useState(initialState.couponCode);
  const [appliedCouponCode, setAppliedCouponCode] = useState(initialState.appliedCouponCode);
  const [couponDiscount, setCouponDiscount] = useState(initialState.couponDiscount);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefilledFromAccount, setPrefilledFromAccount] = useState(false);
  const isCompletingOrderRef = useRef(false);
  const beginCheckoutTrackedRef = useRef(false);
  const customerPrefillAppliedRef = useRef(false);
  const [pendingCouponCode, setPendingCouponCode] = useState<string | null>(null);

  const shippingZone = resolveShippingZone(
    (sameAsBilling ? billing : shipping).postcode,
    (sameAsBilling ? billing : shipping).state,
  );
  const isTrujillo = isTrujilloZone((sameAsBilling ? billing : shipping).postcode);
  const shippingMethods = useMemo(
    () => getShippingMethodsForZone(shippingZone),
    [shippingZone],
  );
  const paymentMethods = useMemo(
    () => PAYMENT_METHODS.filter((method) => !method.trujilloOnly || isTrujillo),
    [isTrujillo],
  );

  const effectiveShippingMethodId = shippingMethods.some((method) => method.id === shippingMethodId)
    ? shippingMethodId
    : (shippingMethods[0]?.id ?? "");
  const effectivePaymentMethodId = paymentMethods.some((method) => method.id === paymentMethodId)
    ? paymentMethodId
    : (paymentMethods[0]?.id ?? "bacs");

  const selectedShipping = getShippingMethodById(effectiveShippingMethodId, shippingZone);
  const shippingCost = selectedShipping?.cost ?? 0;

  const totals = calculateCheckoutTotals(items, shippingCost, couponDiscount);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !user) {
      customerPrefillAppliedRef.current = false;
      return;
    }

    if (customerPrefillAppliedRef.current) return;

    let cancelled = false;

    (async () => {
      let defaultAddress = null;

      try {
        const addresses = await fetchCustomerAddresses();
        defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
      } catch {
        defaultAddress = null;
      }

      if (cancelled) return;

      const prefill = buildCheckoutPrefillFromCustomer(user.name, defaultAddress);
      let didPrefill = false;

      setEmail((current) => {
        if (current.trim()) return current;
        didPrefill = true;
        return user.email;
      });

      setBilling((current) => {
        const merged = mergeAddressPrefill(current, prefill);
        if (addressPrefillChanged(current, merged)) didPrefill = true;
        return merged;
      });

      setShipping((current) => {
        const merged = mergeAddressPrefill(current, prefill);
        if (addressPrefillChanged(current, merged)) didPrefill = true;
        return merged;
      });

      customerPrefillAppliedRef.current = true;
      setPrefilledFromAccount(didPrefill);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, isAuthenticated, user]);

  useEffect(() => {
    if (isCompletingOrderRef.current) return;

    writeCheckoutDraftToStorage({
      billing,
      shipping,
      email,
      orderNotes,
      sameAsBilling,
      shippingMethodId: effectiveShippingMethodId,
      paymentMethodId: effectivePaymentMethodId,
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
    effectiveShippingMethodId,
    effectivePaymentMethodId,
    couponCode,
    appliedCouponCode,
    couponDiscount,
  ]);

  useEffect(() => {
    if (!isHydrated || isCompletingOrderRef.current) return;
    if (items.length === 0) {
      router.replace(ROUTES.cart);
      return;
    }

    if (!beginCheckoutTrackedRef.current) {
      beginCheckoutTrackedRef.current = true;
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      trackBeginCheckout(items, subtotal);
    }
  }, [isHydrated, items, router]);

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

  const applyCoupon = useCallback(
    async (code: string, customerId: string) => {
      await Promise.resolve();

      const normalizedCode = code.trim();
      if (!normalizedCode) {
        setCouponError(CHECKOUT_COPY.couponInvalid);
        setAppliedCouponCode("");
        setCouponDiscount(0);
        return false;
      }

      setIsApplyingCoupon(true);
      setCouponError(null);

      try {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const validated = await validateCheckoutCoupon({
          code: normalizedCode,
          subtotal,
          customerId,
        });

        setAppliedCouponCode(validated.code);
        setCouponCode(validated.code);
        setCouponDiscount(validated.discountAmount);
        setCouponError(null);
        setPendingCouponCode(null);
        return true;
      } catch (error) {
        setCouponError(
          error instanceof Error && error.message ? error.message : CHECKOUT_COPY.couponInvalid,
        );
        setAppliedCouponCode("");
        setCouponDiscount(0);
        setPendingCouponCode(null);
        return false;
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [items],
  );

  useEffect(() => {
    if (!pendingCouponCode || !isAuthenticated || !user || isAuthLoading) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await applyCoupon(pendingCouponCode, user.id);
      if (cancelled) {
        return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pendingCouponCode, isAuthenticated, user, isAuthLoading, applyCoupon]);

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim();
    if (!normalizedCode) {
      setCouponError(CHECKOUT_COPY.couponInvalid);
      setAppliedCouponCode("");
      setCouponDiscount(0);
      return;
    }

    if (!isAuthenticated || !user) {
      setPendingCouponCode(normalizedCode);
      setCouponError(null);
      openLogin({
        message: CHECKOUT_COPY.couponRequiresAccount,
        initialView: "login",
      });
      return;
    }

    await applyCoupon(normalizedCode, user.id);
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

    if (!effectiveShippingMethodId) nextErrors.shippingMethod = CHECKOUT_COPY.requiredField;
    if (!effectivePaymentMethodId) nextErrors.paymentMethod = CHECKOUT_COPY.requiredField;

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

    const shippingMethod = getShippingMethodById(effectiveShippingMethodId, shippingZone);
    const paymentMethod = paymentMethods.find((method) => method.id === effectivePaymentMethodId);

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

      let captchaToken: string | undefined;
      try {
        captchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.checkoutOrder);
      } catch {
        isCompletingOrderRef.current = false;
        setIsSubmitting(false);
        setSubmitError("No pudimos verificar la seguridad del formulario. Intenta de nuevo.");
        return;
      }

      const order = await createOrder({ ...payload, captchaToken });
      let culqiOrderPendingRollback: StoredOrder | null =
        paymentMethod.id === "culqi" ? order : null;

      if (paymentMethod.id === "culqi") {
        if (!isCulqiConfigured()) {
          throw new Error("Los pagos con tarjeta o Yape no están disponibles en este momento.");
        }

        try {
          const prepareCaptchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.checkoutOrder);
          const culqiSession = await prepareCulqiCheckout({
            orderNumber: order.orderNumber,
            email: order.email,
            captchaToken: prepareCaptchaToken,
          });

          const culqiToken = await openCulqiCheckout({
            amountInCentimos: culqiSession.amountInCentimos,
            email: order.email,
            culqiOrderId: culqiSession.culqiOrderId,
            rsaId: culqiSession.rsaId,
            rsaPublicKey: culqiSession.rsaPublicKey,
            title: `Pedido ${order.orderNumber}`,
          });

          storeCulqiPendingCharge({
            orderNumber: order.orderNumber,
            email: order.email,
            culqiToken,
          });
          culqiOrderPendingRollback = null;
        } catch (culqiError) {
          if (culqiOrderPendingRollback) {
            clearCulqiPendingCharge(
              culqiOrderPendingRollback.orderNumber,
              culqiOrderPendingRollback.email,
            );
            try {
              const cancelCaptchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.checkoutOrder);
              await cancelCheckoutOrder({
                orderNumber: culqiOrderPendingRollback.orderNumber,
                email: culqiOrderPendingRollback.email,
                captchaToken: cancelCaptchaToken,
              });
            } catch {
              // El backend también intenta revertir si el cargo falla.
            }
          }

          throw culqiError;
        }
      }

      saveOrder(order);

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

  if (!isHydrated) {
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
                  {isAuthenticated && prefilledFromAccount ? (
                    <p className="checkout-account-prefill mb-4 rounded border border-[#f0d9a8] bg-[#fffdf5] px-3 py-2.5 text-sm text-[#7a6522]">
                      {CHECKOUT_COPY.accountPrefillNotice}
                    </p>
                  ) : null}

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
            shippingMethodId={effectiveShippingMethodId}
            paymentMethodId={effectivePaymentMethodId}
            couponCode={couponCode}
            couponError={couponError}
            couponApplied={Boolean(appliedCouponCode)}
            isApplyingCoupon={isApplyingCoupon}
            isAuthenticated={isAuthenticated}
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
