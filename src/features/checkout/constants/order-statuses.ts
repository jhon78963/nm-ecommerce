import type { OrderStatus } from "@/features/checkout/types/order.types";

export const ORDER_STATUSES: OrderStatus[] = [
  { slug: "pending", name: "Pendiente", sequence: 1 },
  { slug: "processing", name: "En proceso", sequence: 2 },
  { slug: "shipped", name: "Enviado", sequence: 3 },
  { slug: "out-for-delivery", name: "En reparto", sequence: 4 },
  { slug: "delivered", name: "Entregado", sequence: 5 },
];

export function getOrderStatus(slug: string): OrderStatus | undefined {
  return ORDER_STATUSES.find((status) => status.slug === slug);
}
