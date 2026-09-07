export type PaymentStatusSlug = "pending" | "paid" | "failed" | "reviewing" | "refunded";

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Fallido",
  reviewing: "Validando",
  refunded: "Reembolsado",
};

export function formatPaymentStatus(status?: string | null): string {
  if (!status?.trim()) {
    return PAYMENT_STATUS_LABELS.pending;
  }

  return PAYMENT_STATUS_LABELS[status.toLowerCase()] ?? status;
}

export function paymentStatusBadgeClass(status?: string | null): string {
  const normalized = (status ?? "pending").toLowerCase();

  if (normalized === "paid") return "payment-status-badge--paid";
  if (normalized === "failed") return "payment-status-badge--failed";
  if (normalized === "reviewing") return "payment-status-badge--processing";
  if (normalized === "refunded") return "payment-status-badge--cancelled";

  return "payment-status-badge--pending";
}
