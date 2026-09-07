import { env } from "@/config/env";

export interface WhatsAppOrderVoucherInput {
  orderNumber: string;
  totalLabel: string;
}

export function buildWhatsAppOrderVoucherMessage({
  orderNumber,
  totalLabel,
}: WhatsAppOrderVoucherInput): string {
  return [
    "Hola, adjunto el comprobante de pago de mi pedido.",
    "",
    `Pedido: #${orderNumber}`,
    `Monto: ${totalLabel}`,
    "",
    "Gracias.",
  ].join("\n");
}

export function buildWhatsAppOrderVoucherUrl(input: WhatsAppOrderVoucherInput): string {
  const message = buildWhatsAppOrderVoucherMessage(input);
  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
