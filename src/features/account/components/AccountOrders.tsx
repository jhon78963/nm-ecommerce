"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";
import { ACCOUNT_ROUTES } from "@/features/account/constants/account-nav";
import { fetchCustomerOrders } from "@/features/account/services/account-orders.service";
import type { CustomerOrderSummary } from "@/features/account/types/account.types";
import { formatPrice } from "@/features/cart/utils/format-price";
import { PaymentStatusBadge } from "@/features/checkout/components/PaymentStatusBadge";
import { ROUTES } from "@/lib/routes";

export function AccountOrders() {
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCustomerOrders(page)
      .then((response) => {
        if (cancelled) return;
        setOrders(response.orders);
        setTotalPages(response.meta.totalPages);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setOrders([]);
        setError(err instanceof Error ? err.message : "No se pudieron cargar los pedidos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="account-card dashboard-table">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Mis pedidos</h2>
        </div>

        {loading ? <p className="account-loading">Cargando pedidos…</p> : null}

        {!loading && error ? (
          <AccountEmptyState
            title="No pudimos cargar tus pedidos"
            description={error}
          />
        ) : null}

        {!loading && !error && orders.length === 0 ? (
          <AccountEmptyState
            title="Aún no tienes pedidos"
            description="Cuando compres estando conectado a tu cuenta, tus pedidos aparecerán aquí."
            action={
              <Link href={ROUTES.collection("tienda")} className="btn btn-solid">
                Ir a la tienda
              </Link>
            }
          />
        ) : null}

        {!loading && !error && orders.length > 0 ? (
          <>
            <div className="account-table-wrap">
              <table className="account-table order-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.orderNumber}</strong>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <PaymentStatusBadge
                          status={order.paymentStatus}
                          label={order.paymentStatusLabel}
                        />
                      </td>
                      <td>{order.paymentMethodTitle}</td>
                      <td>{order.statusLabel}</td>
                      <td>
                        <Link
                          href={ACCOUNT_ROUTES.orderDetail(order.orderNumber)}
                          aria-label={`Ver pedido ${order.orderNumber}`}
                        >
                          <Eye className="size-[18px] text-[#555]" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="account-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Anterior
                </button>
                <button type="button" className="is-active" disabled>
                  {page}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Siguiente
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
