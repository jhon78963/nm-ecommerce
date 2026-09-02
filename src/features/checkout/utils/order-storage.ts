import { ORDER_STORAGE_KEY } from "@/features/checkout/constants/order-storage";
import type { StoredOrder } from "@/features/checkout/types/order.types";

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") return false;

  const order = value as Partial<StoredOrder>;

  return (
    typeof order.id === "string"
    && typeof order.orderNumber === "string"
    && typeof order.email === "string"
    && Array.isArray(order.items)
  );
}

export function readOrdersFromStorage(): StoredOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isStoredOrder);
  } catch {
    return [];
  }
}

export function writeOrdersToStorage(orders: StoredOrder[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

export function saveOrder(order: StoredOrder) {
  const orders = readOrdersFromStorage();
  writeOrdersToStorage([order, ...orders]);
}

export function findOrder(orderNumber: string, emailOrPhone: string): StoredOrder | null {
  const normalizedOrderNumber = orderNumber.trim().toUpperCase();
  const normalizedContact = emailOrPhone.trim().toLowerCase();

  return (
    readOrdersFromStorage().find((order) => {
      const matchesNumber = order.orderNumber.toUpperCase() === normalizedOrderNumber;
      const emailMatch = order.email.toLowerCase() === normalizedContact;
      const phoneMatch = order.billing.phone.replace(/\s/g, "") === normalizedContact.replace(/\s/g, "");
      const shippingPhoneMatch =
        order.shipping.phone.replace(/\s/g, "") === normalizedContact.replace(/\s/g, "");

      return matchesNumber && (emailMatch || phoneMatch || shippingPhoneMatch);
    }) ?? null
  );
}

export function getOrderByNumber(orderNumber: string): StoredOrder | null {
  const normalized = orderNumber.trim().toUpperCase();
  return (
    readOrdersFromStorage().find((order) => order.orderNumber.toUpperCase() === normalized) ?? null
  );
}
