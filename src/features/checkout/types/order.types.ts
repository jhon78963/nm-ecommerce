import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";

export type OrderStatusSlug =
  | "pending"
  | "processing"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface OrderStatus {
  slug: OrderStatusSlug;
  name: string;
  sequence: number;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  status: OrderStatusSlug;
  createdAt: string;
  email: string;
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  orderNotes?: string;
  items: CartLineItem[];
  shippingMethodId: string;
  shippingMethodTitle: string;
  shippingTotal: number;
  paymentMethodId: string;
  paymentMethodTitle: string;
  paymentStatus: "pending" | "paid";
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
}
