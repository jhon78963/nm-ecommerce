import { env } from "@/config/env";

export interface WhatsAppProductPurchaseInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceLabel: string;
  sizeLabel?: string | null;
  colorLabel?: string | null;
  sku?: string | null;
  productUrl?: string | null;
}

const PDP_REF_PREFIX = "[NM-PDP:";

export function buildPdpPurchaseRefToken(input: {
  productId: string;
  quantity: number;
  sku?: string | null;
}): string {
  const productPrefix = String(input.productId).replace(/-/g, "").slice(0, 8).toLowerCase();
  const parts = [`pid=${productPrefix}`, `qty=${Math.max(1, input.quantity)}`];

  if (input.sku?.trim()) {
    parts.push(`sku=${input.sku.trim()}`);
  }

  return `${PDP_REF_PREFIX}${parts.join(";")}]`;
}

export function appendWhatsAppUtmParams(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "whatsapp");
    parsed.searchParams.set("utm_medium", "pdp");
    parsed.searchParams.set("utm_campaign", "malu");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function buildWhatsAppProductPurchaseMessage({
  productId,
  productName,
  quantity,
  unitPriceLabel,
  sizeLabel,
  colorLabel,
  sku,
  productUrl,
}: WhatsAppProductPurchaseInput): string {
  const lines = [
    "Hola Malu, quiero comprar este producto:",
    "",
    `Producto: ${productName}`,
    `Cantidad: ${Math.max(1, quantity)}`,
    `Precio unitario: ${unitPriceLabel}`,
  ];

  if (sizeLabel !== undefined) {
    lines.push(`Talla: ${sizeLabel || "Sin seleccionar"}`);
  }

  if (colorLabel !== undefined) {
    lines.push(`Color: ${colorLabel || "Sin seleccionar"}`);
  }

  if (sku?.trim()) {
    lines.push(`SKU: ${sku.trim()}`);
  }

  const resolvedUrl = productUrl ? appendWhatsAppUtmParams(productUrl) : null;
  if (resolvedUrl) {
    lines.push(`Enlace: ${resolvedUrl}`);
  }

  lines.push(
    "",
    buildPdpPurchaseRefToken({ productId, quantity, sku }),
    "",
    "Gracias.",
  );

  return lines.join("\n");
}

export function buildWhatsAppProductPurchaseUrl(input: WhatsAppProductPurchaseInput): string {
  const message = buildWhatsAppProductPurchaseMessage(input);
  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
