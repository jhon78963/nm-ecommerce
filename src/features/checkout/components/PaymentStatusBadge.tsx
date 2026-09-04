import {
  formatPaymentStatus,
  paymentStatusBadgeClass,
} from "@/features/checkout/constants/payment-statuses";

interface PaymentStatusBadgeProps {
  status?: string | null;
  label?: string | null;
  className?: string;
}

export function PaymentStatusBadge({ status, label, className = "" }: PaymentStatusBadgeProps) {
  const resolvedStatus = status ?? "pending";
  const resolvedLabel = label?.trim() || formatPaymentStatus(resolvedStatus);

  return (
    <span className={`account-badge ${paymentStatusBadgeClass(resolvedStatus)} ${className}`.trim()}>
      {resolvedLabel}
    </span>
  );
}
