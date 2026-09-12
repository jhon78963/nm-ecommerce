import { env } from "@/config/env";
import {
  buildPdpPurchaseRefToken,
  buildWhatsAppProductPurchaseMessage,
  type WhatsAppProductPurchaseInput,
} from "@/features/product/utils/build-whatsapp-product-purchase";

import type { WhatsAppPendingCartLine } from "./types";

export function pendingLineToPurchaseInput(line: WhatsAppPendingCartLine): WhatsAppProductPurchaseInput {
  return {
    productId: line.productId,
    productName: line.productName,
    quantity: line.quantity,
    unitPriceLabel: line.unitPriceLabel,
    sizeLabel: line.sizeLabel,
    colorLabel: line.colorLabel,
    sku: line.sku,
    productUrl: line.productUrl,
  };
}

/** One WhatsApp message with several NM-PDP tokens → single guest cart on Malu. */
export function buildWhatsAppPendingCartBatchMessage(lines: WhatsAppPendingCartLine[]): string {
  if (lines.length === 0) {
    return "Hola Malu, quiero comprar productos de mi carrito en la tienda.";
  }

  if (lines.length === 1) {
    return buildWhatsAppProductPurchaseMessage(pendingLineToPurchaseInput(lines[0]!));
  }

  const blocks = lines.map((line) => {
    const input = pendingLineToPurchaseInput(line);
    const token = buildPdpPurchaseRefToken({
      productId: input.productId,
      quantity: input.quantity,
      sku: input.sku,
    });

    return [
      `Producto: ${input.productName}`,
      `Cantidad: ${Math.max(1, input.quantity)}`,
      `Precio unitario: ${input.unitPriceLabel}`,
      input.sizeLabel !== undefined ? `Talla: ${input.sizeLabel || "Sin seleccionar"}` : null,
      input.colorLabel !== undefined ? `Color: ${input.colorLabel || "Sin seleccionar"}` : null,
      input.sku?.trim() ? `SKU: ${input.sku.trim()}` : null,
      input.productUrl ? `Enlace: ${input.productUrl}` : null,
      token,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    "Hola Malu, quiero comprar estos productos de mi carrito:",
    "",
    blocks.join("\n\n"),
    "",
    "Gracias.",
  ].join("\n");
}

export function buildWhatsAppPendingCartBatchUrl(lines: WhatsAppPendingCartLine[]): string {
  const message = buildWhatsAppPendingCartBatchMessage(lines);
  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
