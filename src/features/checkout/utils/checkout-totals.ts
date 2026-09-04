import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { CheckoutTotals } from "@/features/checkout/types/checkout.types";
import type { ShippingZone } from "@/features/checkout/constants/peru-departments";
import {
  LA_LIBERTAD_SHIPPING_METHODS,
  NATIONAL_SHIPPING_METHODS,
  TRUJILLO_SHIPPING_METHODS,
} from "@/features/checkout/constants/shipping-methods";

export function getShippingMethodsForZone(zone: ShippingZone) {
  switch (zone) {
    case "trujillo":
      return TRUJILLO_SHIPPING_METHODS;
    case "la-libertad":
      return LA_LIBERTAD_SHIPPING_METHODS;
    default:
      return NATIONAL_SHIPPING_METHODS;
  }
}

export function getShippingMethodById(id: string, zone: ShippingZone) {
  return getShippingMethodsForZone(zone).find((method) => method.id === id);
}

export function calculateCheckoutTotals(
  items: CartLineItem[],
  shippingCost: number,
  couponDiscount: number,
): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingCost - couponDiscount);

  return {
    subtotal,
    shippingTotal: shippingCost,
    couponDiscount,
    total,
  };
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = String(Math.floor(1000 + Math.random() * 9000));
  return `NM-${datePart}-${randomPart}`;
}
