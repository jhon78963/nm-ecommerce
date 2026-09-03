import type { CartLineItem } from "@/features/cart/types/cart.types";
import { resolveCartLineVariantIds } from "@/features/cart/utils/cart-variant";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";
import type { OrderStatusSlug, StoredOrder } from "@/features/checkout/types/order.types";

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

export class CheckoutApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CheckoutApiError";
  }
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

async function requestCheckoutApi<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "No pudimos procesar tu pedido. Intenta nuevamente.";

    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // ignore parse errors
    }

    throw new CheckoutApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function buildCreateOrderPayload(
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
    email,
    billing,
    shipping,
    sameAsBilling,
    orderNotes: orderNotes || undefined,
    shippingMethodId,
    paymentMethodId,
    couponCode: couponCode || undefined,
    items: items.map((item) => {
      const { productSizeId, colorId } = resolveCartLineVariantIds(item);

      return {
        productId: item.productId,
        productSizeId: productSizeId ?? "",
        colorId,
        name: item.name,
        variation: item.variation,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPrice: item.price,
      };
    }),
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<StoredOrder> {
  const response = await requestCheckoutApi<ApiOrder>("/api/checkout/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapApiOrderToStoredOrder(response);
}

export async function trackOrder(orderNumber: string, contact: string): Promise<StoredOrder> {
  const params = new URLSearchParams({ orderNumber, contact });
  const response = await requestCheckoutApi<ApiOrder>(`/api/checkout/track?${params.toString()}`);

  return mapApiOrderToStoredOrder(response);
}

export async function fetchPublicOrder(
  orderNumber: string,
  email: string,
): Promise<StoredOrder> {
  const params = new URLSearchParams({ email });
  const response = await requestCheckoutApi<ApiOrder>(
    `/api/checkout/order/${encodeURIComponent(orderNumber)}?${params.toString()}`,
  );

  return mapApiOrderToStoredOrder(response);
}

export function getOrderApiErrorMessage(error: unknown): string {
  if (error instanceof CheckoutApiError) {
    if (error.status === 404) {
      return "No encontramos un pedido con esos datos.";
    }

    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No pudimos procesar tu pedido. Intenta nuevamente.";
}
