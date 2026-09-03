"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";
import { ACCOUNT_ROUTES } from "@/features/account/constants/account-nav";
import { fetchCustomerOrder } from "@/features/account/services/account-orders.service";
import { OrderStatusTracker } from "@/features/checkout/components/OrderStatusTracker";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { getDepartmentName } from "@/features/checkout/constants/peru-departments";
import type { StoredOrder } from "@/features/checkout/types/order.types";
import { formatAddress, formatFullName } from "@/features/checkout/utils/address";
import { formatPrice } from "@/features/cart/utils/format-price";
import { StoreImage } from "@/components/ui/StoreImage";

import "@/features/checkout/components/order.css";

interface AccountOrderDetailProps {
  orderNumber: string;
}

export function AccountOrderDetail({ orderNumber }: AccountOrderDetailProps) {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCustomerOrder(orderNumber)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setOrder(null);
          setError(err instanceof Error ? err.message : "Pedido no encontrado.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (loading) {
    return <p className="account-loading">Cargando pedido…</p>;
  }

  if (error || !order) {
    return (
      <AccountEmptyState
        title="Pedido no encontrado"
        description={error ?? CHECKOUT_COPY.orderNotFoundDescription}
        action={
          <Link href={ACCOUNT_ROUTES.orders} className="btn btn-solid">
            Volver a mis pedidos
          </Link>
        }
      />
    );
  }

  return (
    <div className="order-details">
      <div className="order-details-header">
        <Link href={ACCOUNT_ROUTES.orders} className="back-link">
          <ArrowLeft className="size-4" />
          {CHECKOUT_COPY.back}
        </Link>
        <h2>
          {CHECKOUT_COPY.orderNumber}: #{order.orderNumber}
        </h2>
      </div>

      <OrderStatusTracker order={order} />

      <div className="dashboard-table" style={{ marginTop: 24 }}>
        <div className="account-card__body">
          <h3 className="mb-4 text-lg font-bold">Productos</h3>
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <StoreImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover"
                          />
                        ) : null}
                        <div>
                          <strong>{item.name}</strong>
                          {item.variation ? (
                            <p className="text-xs text-[#777]">{item.variation}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="account-info-box">
              <h3>Envío</h3>
              <p>{formatFullName(order.shipping)}</p>
              <p>{formatAddress(order.shipping)}</p>
              <p>{getDepartmentName(order.shipping.state)}</p>
              <p>{order.shippingMethodTitle}</p>
            </div>
            <div className="account-info-box">
              <h3>Resumen</h3>
              <p>Subtotal: {formatPrice(order.subtotal)}</p>
              <p>Envío: {formatPrice(order.shippingTotal)}</p>
              {order.couponDiscount > 0 ? (
                <p>Descuento: -{formatPrice(order.couponDiscount)}</p>
              ) : null}
              <p>
                <strong>Total: {formatPrice(order.total)}</strong>
              </p>
              <p>Método de pago: {order.paymentMethodTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
