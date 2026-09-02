import { CHECKOUT_DRAFT_STORAGE_KEY } from "@/features/checkout/constants/checkout-storage";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";
import { createEmptyAddress } from "@/features/checkout/utils/address";

export interface CheckoutFormDraft {
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  email: string;
  orderNotes: string;
  sameAsBilling: boolean;
  shippingMethodId: string;
  paymentMethodId: string;
  couponCode: string;
  appliedCouponCode: string;
  couponDiscount: number;
}

function parseAddress(value: unknown): CheckoutAddress {
  if (!value || typeof value !== "object") {
    return createEmptyAddress();
  }

  const address = value as Partial<CheckoutAddress>;

  return {
    firstName: typeof address.firstName === "string" ? address.firstName : "",
    lastName: typeof address.lastName === "string" ? address.lastName : "",
    country: typeof address.country === "string" ? address.country : "PE",
    address1: typeof address.address1 === "string" ? address.address1 : "",
    address2: typeof address.address2 === "string" ? address.address2 : "",
    city: typeof address.city === "string" ? address.city : "",
    state: typeof address.state === "string" ? address.state : "LAL",
    postcode: typeof address.postcode === "string" ? address.postcode : "",
    phone: typeof address.phone === "string" ? address.phone : "",
  };
}

function isCheckoutFormDraft(value: unknown): value is CheckoutFormDraft {
  if (!value || typeof value !== "object") return false;

  const draft = value as Partial<CheckoutFormDraft>;

  return (
    typeof draft.email === "string"
    && typeof draft.orderNotes === "string"
    && typeof draft.sameAsBilling === "boolean"
    && typeof draft.shippingMethodId === "string"
    && typeof draft.paymentMethodId === "string"
    && typeof draft.couponCode === "string"
    && typeof draft.appliedCouponCode === "string"
    && typeof draft.couponDiscount === "number"
    && draft.billing !== undefined
    && draft.shipping !== undefined
  );
}

export function readCheckoutDraftFromStorage(): CheckoutFormDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isCheckoutFormDraft(parsed)) return null;

    return {
      ...parsed,
      billing: parseAddress(parsed.billing),
      shipping: parseAddress(parsed.shipping),
    };
  } catch {
    return null;
  }
}

export function writeCheckoutDraftToStorage(draft: CheckoutFormDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function clearCheckoutDraftFromStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
}
