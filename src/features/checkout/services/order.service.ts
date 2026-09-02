import { env } from "@/config/env";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";
import type { OrderStatusSlug, StoredOrder } from "@/features/checkout/types/order.types";
import { apiGet, apiPost, HttpError } from "@/services/http-client";

interface ApiOrderItem {
  id: string;
  productId: string;
  productSizeId: string;
  colorId: string | null;
  name: string;
  variation?: string | null;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: OrderStatusSlug;
  statusLabel?: string;
  paymentStatus: "pending" | "paid";
  createdAt: string;
  email: string;
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  orderNotes?: string | null;
  shippingMethodId: string;
  shippingMethodTitle: string;
  shippingTotal: number;
  paymentMethodId: string;
  paymentMethodTitle: string;
  subtotal: number;
  couponCode?: string | null;
  couponDiscount: number;
  total: number;
  items: ApiOrderItem[];
}

export interface CreateOrderPayload {
  warehouseId: string;
  email: string;
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  sameAsBilling: boolean;
  orderNotes?: string;
  shippingMethodId: string;
  paymentMethodId: string;
  couponCode?: string;
  items: Array<{
    productId: string;
    productSizeId: string;
    colorId?: string;
    name: string;
    variation?: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
  }>;
}

function mapApiOrderToStoredOrder(order: ApiOrder): StoredOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    email: order.email,
    billing: order.billing,
    shipping: order.shipping,
    orderNotes: order.orderNotes ?? undefined,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productSizeId: item.productSizeId,
      colorId: item.colorId ?? undefined,
      name: item.name,
      imageUrl: item.imageUrl ?? undefined,
      quantity: item.quantity,
      price: item.unitPrice,
      variation: item.variation ?? undefined,
    })),
    shippingMethodId: order.shippingMethodId,
    shippingMethodTitle: order.shippingMethodTitle,
    shippingTotal: order.shippingTotal,
    paymentMethodId: order.paymentMethodId,
    paymentMethodTitle: order.paymentMethodTitle,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    couponCode: order.couponCode ?? undefined,
    couponDiscount: order.couponDiscount,
    total: order.total,
  };
}

export function buildCreateOrderPayload(
  warehouseId: string,
  email: string,
  billing: CheckoutAddress,
  shipping: CheckoutAddress,
  sameAsBilling: boolean,
  orderNotes: string,
  shippingMethodId: string,
  paymentMethodId: string,
  couponCode: string,
  items: CartLineItem[],
): CreateOrderPayload {
  return {
    warehouseId,
    email,
    billing,
    shipping,
    sameAsBilling,
    orderNotes: orderNotes || undefined,
    shippingMethodId,
    paymentMethodId,
    couponCode: couponCode || undefined,
    items: items.map((item) => ({
      productId: item.productId,
      productSizeId: item.productSizeId ?? item.variationId ?? "",
      colorId: item.colorId,
      name: item.name,
      variation: item.variation,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<StoredOrder> {
  const response = await apiPost<ApiOrder>("ecommerce/orders", payload);
  return mapApiOrderToStoredOrder(response);
}

export async function trackOrder(orderNumber: string, contact: string): Promise<StoredOrder> {
  const response = await apiGet<ApiOrder>("ecommerce/orders/track", {
    params: { orderNumber, contact },
  });

  return mapApiOrderToStoredOrder(response);
}

export async function fetchPublicOrder(
  orderNumber: string,
  email: string,
): Promise<StoredOrder> {
  const response = await apiGet<ApiOrder>(
    `ecommerce/orders/public/${encodeURIComponent(orderNumber)}`,
    { params: { email } },
  );

  return mapApiOrderToStoredOrder(response);
}

export function getOrderApiErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 404) {
      return "No encontramos un pedido con esos datos.";
    }

    if (error.status === 422) {
      return "Uno o más productos no tienen stock suficiente. Revisa tu carrito.";
    }
  }

  return "No pudimos procesar tu pedido. Intenta nuevamente.";
}

export function getWarehouseIdForCheckout(): string {
  const warehouseId = env.storeWarehouseId;
  if (!warehouseId) {
    throw new Error("STORE_WAREHOUSE_ID no está configurado.");
  }

  return warehouseId;
}
