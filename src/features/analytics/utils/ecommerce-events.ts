import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { StoredOrder } from "@/features/checkout/types/order.types";

import { ANALYTICS_CURRENCY } from "@/features/analytics/constants/analytics";
import type { AnalyticsItem } from "@/features/analytics/types/data-layer.types";
import { clearEcommerceDataLayer, pushDataLayerEvent } from "@/features/analytics/utils/data-layer";

function toAnalyticsItem(item: Pick<CartLineItem, "productId" | "name" | "price" | "quantity" | "variation">): AnalyticsItem {
  return {
    item_id: item.productId,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
    ...(item.variation ? { item_variant: item.variation } : {}),
  };
}

export function trackViewItem(item: Pick<CartLineItem, "productId" | "name" | "price" | "variation">): void {
  clearEcommerceDataLayer();
  pushDataLayerEvent({
    event: "view_item",
    ecommerce: {
      currency: ANALYTICS_CURRENCY,
      value: item.price,
      items: [toAnalyticsItem({ ...item, quantity: 1 })],
    },
  });
}

export function trackAddToCart(item: Pick<CartLineItem, "productId" | "name" | "price" | "quantity" | "variation">): void {
  clearEcommerceDataLayer();
  pushDataLayerEvent({
    event: "add_to_cart",
    ecommerce: {
      currency: ANALYTICS_CURRENCY,
      value: item.price * item.quantity,
      items: [toAnalyticsItem(item)],
    },
  });
}

export function trackBeginCheckout(items: CartLineItem[], value: number): void {
  clearEcommerceDataLayer();
  pushDataLayerEvent({
    event: "begin_checkout",
    ecommerce: {
      currency: ANALYTICS_CURRENCY,
      value,
      items: items.map(toAnalyticsItem),
    },
  });
}

export function trackPurchase(order: StoredOrder): void {
  clearEcommerceDataLayer();
  pushDataLayerEvent({
    event: "purchase",
    ecommerce: {
      transaction_id: order.orderNumber,
      currency: ANALYTICS_CURRENCY,
      value: order.total,
      tax: 0,
      shipping: order.shippingTotal,
      coupon: order.couponCode,
      items: order.items.map(toAnalyticsItem),
    },
  });
}
