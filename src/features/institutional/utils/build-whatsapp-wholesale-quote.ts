import { env } from "@/config/env";

export interface WholesaleQuoteWhatsAppInput {
  businessName?: string;
  contactName?: string;
  phone?: string;
  city?: string;
  businessType?: string;
  productLines?: string;
  estimatedUnits?: string;
  message?: string;
  quoteNumber?: string;
}

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  tienda: "Tienda / bazar",
  feria: "Feria / mercado",
  ecommerce: "Ecommerce / redes",
  otro: "Otro",
};

function slugifyToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function buildWholesaleQuoteRefToken(input: WholesaleQuoteWhatsAppInput): string {
  const parts = ["source=web"];

  if (input.quoteNumber?.trim()) {
    parts.push(`ref=${input.quoteNumber.trim()}`);
  }

  if (input.city?.trim()) {
    parts.push(`city=${slugifyToken(input.city)}`);
  }

  if (input.estimatedUnits?.trim()) {
    parts.push(`units=${slugifyToken(input.estimatedUnits)}`);
  }

  return `[NM-B2B:${parts.join(";")}]`;
}

export function buildWholesaleQuoteWhatsAppMessage(input: WholesaleQuoteWhatsAppInput): string {
  const lines = ["Hola Malu, solicito cotización mayorista:", ""];

  if (input.quoteNumber?.trim()) {
    lines.push(`Referencia: ${input.quoteNumber.trim()}`);
  }

  if (input.businessName?.trim()) {
    lines.push(`Negocio: ${input.businessName.trim()}`);
  }

  if (input.contactName?.trim()) {
    lines.push(`Contacto: ${input.contactName.trim()}`);
  }

  if (input.phone?.trim()) {
    lines.push(`Teléfono: ${input.phone.trim()}`);
  }

  if (input.city?.trim()) {
    lines.push(`Ciudad: ${input.city.trim()}`);
  }

  if (input.businessType?.trim()) {
    const label = BUSINESS_TYPE_LABELS[input.businessType] ?? input.businessType;
    lines.push(`Tipo de negocio: ${label}`);
  }

  if (input.productLines?.trim()) {
    lines.push(`Líneas de interés: ${input.productLines.trim()}`);
  }

  if (input.estimatedUnits?.trim()) {
    lines.push(`Cantidad estimada: ${input.estimatedUnits.trim()}`);
  }

  if (input.message?.trim()) {
    lines.push("", "Detalle:", input.message.trim());
  }

  lines.push("", buildWholesaleQuoteRefToken(input), "", "Gracias.");

  return lines.join("\n");
}

export function buildWholesaleQuoteWhatsAppUrl(input: WholesaleQuoteWhatsAppInput = {}): string {
  const message = buildWholesaleQuoteWhatsAppMessage(input);
  return `https://wa.me/${env.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
