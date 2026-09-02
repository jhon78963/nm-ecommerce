"use client";

import { ORDER_STATUSES } from "@/features/checkout/constants/order-statuses";
import type { StoredOrder } from "@/features/checkout/types/order.types";

interface OrderStatusTrackerProps {
  order: StoredOrder;
}

export function OrderStatusTracker({ order }: OrderStatusTrackerProps) {
  const currentStatus = ORDER_STATUSES.find((status) => status.slug === order.status);
  const currentSequence = currentStatus?.sequence ?? 1;

  if (order.status === "cancelled") {
    return (
      <div className="tracking-panel">
        <ul>
          <li className="active cancelled-box">
            <div className="panel-content">
              <div className="status">Cancelado</div>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="tracking-panel">
      <ul>
        {ORDER_STATUSES.map((status) => (
          <li
            key={status.slug}
            className={status.sequence <= currentSequence ? "active" : ""}
          >
            <div className="panel-content">
              <div className="status">{status.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
