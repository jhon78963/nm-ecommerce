import type { CustomerOrdersResponse } from "@/features/account/types/account.types";
import type { OrderStatusSlug, PaymentStatusSlug, StoredOrder } from "@/features/checkout/types/order.types";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";

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
  paymentStatus: PaymentStatusSlug;
  paymentStatusLabel?: string;
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

function mapApiOrder(order: ApiOrder): StoredOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: order.statusLabel,
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
    paymentStatusLabel: order.paymentStatusLabel,
    subtotal: order.subtotal,
    couponCode: order.couponCode ?? undefined,
    couponDiscount: order.couponDiscount,
    total: order.total,
  };
}

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? "No se pudo cargar la información.";
  } catch {
    return "No se pudo cargar la información.";
  }
}

export async function fetchCustomerOrders(page = 1, perPage = 10) {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });

  const response = await fetch(`/api/account/orders?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<CustomerOrdersResponse>;
}

export async function fetchCustomerOrder(orderNumber: string) {
  const response = await fetch(
    `/api/account/orders/${encodeURIComponent(orderNumber)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return mapApiOrder((await response.json()) as ApiOrder);
}
