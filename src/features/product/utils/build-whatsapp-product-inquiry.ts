import { env } from "@/config/env";

export interface WhatsAppProductInquiryInput {
  productName: string;
  sizeLabel?: string | null;
  colorLabel?: string | null;
  barcode?: string | null;
  productUrl?: string | null;
}

export function buildWhatsAppProductInquiryMessage({
  productName,
  sizeLabel,
  colorLabel,
  barcode,
  productUrl,
}: WhatsAppProductInquiryInput): string {
  const lines = [
    "Hola, me gustaría consultar por el siguiente producto:",
    "",
    `Producto: ${productName}`,
  ];

  if (sizeLabel !== undefined) {
    lines.push(`Talla: ${sizeLabel || "Sin seleccionar"}`);
  }

  if (colorLabel !== undefined) {
    lines.push(`Color: ${colorLabel || "Sin seleccionar"}`);
  }

  if (barcode) {
    lines.push(`Código de barras: ${barcode}`);
  }

  if (productUrl) {
    lines.push(`Enlace: ${productUrl}`);
  }

  lines.push("", "Gracias.");

  return lines.join("\n");
}

export function buildWhatsAppProductInquiryUrl(input: WhatsAppProductInquiryInput): string {
  const message = buildWhatsAppProductInquiryMessage(input);
  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
