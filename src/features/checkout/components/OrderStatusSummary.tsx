import { PaymentStatusBadge } from "@/features/checkout/components/PaymentStatusBadge";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import type { StoredOrder } from "@/features/checkout/types/order.types";

interface OrderStatusSummaryProps {
  order: StoredOrder;
}

export function OrderStatusSummary({ order }: OrderStatusSummaryProps) {
  return (
    <div className="order-status-summary">
      <div className="order-status-summary__item">
        <span className="order-status-summary__label">{CHECKOUT_COPY.paymentStatus}</span>
        <PaymentStatusBadge status={order.paymentStatus} label={order.paymentStatusLabel} />
      </div>
    </div>
  );
}
