import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatPrice } from "@/features/cart/utils/format-price";
import { buildAbsolutePublicUrl } from "@/lib/public-site-url";

import { WHATSAPP_PENDING_CART_STORAGE_KEY } from "./constants";
import type { WhatsAppPendingCartLine } from "./types";

function lineKey(line: WhatsAppPendingCartLine): string {
  return [
    line.productId,
    line.sizeLabel ?? "",
    line.colorLabel ?? "",
    line.sku ?? "",
  ].join(":");
}

function isPendingLine(value: unknown): value is WhatsAppPendingCartLine {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<WhatsAppPendingCartLine>;
  return (
    typeof row.productId === "string"
    && typeof row.productName === "string"
    && typeof row.quantity === "number"
    && row.quantity > 0
    && typeof row.unitPriceLabel === "string"
  );
}

export function readWhatsAppPendingCart(): WhatsAppPendingCartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WHATSAPP_PENDING_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPendingLine);
  } catch {
    return [];
  }
}

export function writeWhatsAppPendingCart(lines: WhatsAppPendingCartLine[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WHATSAPP_PENDING_CART_STORAGE_KEY, JSON.stringify(lines));
}

export function mergeWhatsAppPendingLine(line: WhatsAppPendingCartLine): WhatsAppPendingCartLine[] {
  const current = readWhatsAppPendingCart();
  const key = lineKey(line);
  const existing = current.find((entry) => lineKey(entry) === key);

  if (!existing) {
    const next = [...current, line];
    writeWhatsAppPendingCart(next);
    return next;
  }

  const next = current.map((entry) =>
    lineKey(entry) === key
      ? { ...entry, quantity: entry.quantity + line.quantity }
      : entry,
  );
  writeWhatsAppPendingCart(next);
  return next;
}

export function cartLineItemToWhatsAppPending(line: CartLineItem): WhatsAppPendingCartLine {
  const productUrl = line.slug ? buildAbsolutePublicUrl(`/producto/${line.slug}`) : null;
  const [sizeLabel, colorLabel] = splitVariation(line.variation);

  return {
    productId: line.productId,
    productName: line.name,
    quantity: line.quantity,
    unitPriceLabel: formatPrice(line.price),
    sizeLabel,
    colorLabel,
    sku: null,
    productUrl,
  };
}

export function syncWhatsAppPendingFromCartLine(line: CartLineItem): void {
  mergeWhatsAppPendingLine(cartLineItemToWhatsAppPending(line));
}

function splitVariation(variation?: string): [string | null, string | null] {
  if (!variation?.trim()) return [null, null];
  const parts = variation.split("/").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0] ?? null, parts[1] ?? null];
  return [parts[0] ?? null, null];
}
