import type { CartLineItem } from "@/features/cart/types/cart.types";
import { mapServerCartLine, toUpsertCartPayload } from "@/features/cart/utils/cart-merge";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string; error?: string };
    return body.message || body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchCustomerCart(): Promise<CartLineItem[]> {
  const response = await fetch("/api/account/cart");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo cargar tu carrito."));
  }

  const body = (await response.json()) as { items?: CartLineItem[] };
  return (body.items ?? []).map(mapServerCartLine);
}

export async function saveCustomerCart(items: CartLineItem[]): Promise<CartLineItem[]> {
  const response = await fetch("/api/account/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: toUpsertCartPayload(items) }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo guardar tu carrito."));
  }

  const body = (await response.json()) as { items?: CartLineItem[] };
  return (body.items ?? []).map(mapServerCartLine);
}

export async function clearCustomerCart(): Promise<void> {
  const response = await fetch("/api/account/cart", { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw new Error(await parseError(response, "No se pudo vaciar tu carrito."));
  }
}
