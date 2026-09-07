"use client";

import { useEffect, useMemo, useState } from "react";

import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";
import { AccountModal } from "@/features/account/components/AccountModal";
import { fetchCustomerOrders } from "@/features/account/services/account-orders.service";
import {
  createRefundRequest,
  fetchCustomerRefunds,
} from "@/features/account/services/account-refunds.service";
import type { CustomerOrderSummary, CustomerRefund } from "@/features/account/types/account.types";
import { formatPrice } from "@/features/cart/utils/format-price";
import { normalizeOrderNumberForLookup } from "@/features/checkout/utils/order-number";

const REFUND_ELIGIBLE_ORDER_STATUSES = new Set([
  "processing",
  "shipped",
  "out-for-delivery",
  "delivered",
]);

function isRefundEligible(order: CustomerOrderSummary): boolean {
  return order.paymentStatus === "paid" && REFUND_ELIGIBLE_ORDER_STATUSES.has(order.status);
}

function refundBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved" || normalized === "completed") return "account-badge--paid";
  if (normalized === "rejected") return "account-badge--failed";
  return "account-badge--pending";
}

function formatRefundStatus(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    completed: "Completado",
  };

  return labels[status.toLowerCase()] ?? status;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(value));
}

export function AccountRefunds() {
  const [refunds, setRefunds] = useState<CustomerRefund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [eligibleOrders, setEligibleOrders] = useState<CustomerOrderSummary[]>([]);
  const [loadingEligibleOrders, setLoadingEligibleOrders] = useState(false);

  const selectedEligibleOrder = useMemo(
    () => eligibleOrders.find((order) => order.orderNumber === orderNumber) ?? null,
    [eligibleOrders, orderNumber],
  );

  const loadRefunds = () => {
    setLoading(true);
    setError(null);

    fetchCustomerRefunds()
      .then(setRefunds)
      .catch((err: unknown) => {
        setRefunds([]);
        setError(err instanceof Error ? err.message : "No se pudieron cargar los reembolsos.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    let cancelled = false;
    setLoadingEligibleOrders(true);

    fetchCustomerOrders(1, 50)
      .then((response) => {
        if (cancelled) return;
        setEligibleOrders(response.orders.filter(isRefundEligible));
      })
      .catch(() => {
        if (!cancelled) setEligibleOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingEligibleOrders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [modalOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const normalizedOrderNumber = normalizeOrderNumberForLookup(orderNumber);
    if (!normalizedOrderNumber) {
      setError("Ingresa un número de pedido válido.");
      setSaving(false);
      return;
    }

    try {
      await createRefundRequest({
        orderNumber: normalizedOrderNumber,
        reason: reason.trim(),
      });
      setModalOpen(false);
      setOrderNumber("");
      setReason("");
      loadRefunds();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la solicitud.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-card dashboard-table">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Historial de reembolsos</h2>
          <button type="button" className="account-btn account-btn--solid" onClick={() => setModalOpen(true)}>
            Solicitar reembolso
          </button>
        </div>

        {loading ? <p className="account-loading">Cargando reembolsos…</p> : null}
        {error ? <p className="account-form-message account-form-message--error">{error}</p> : null}

        {!loading && refunds.length === 0 ? (
          <AccountEmptyState
            title="Sin reembolsos"
            description="Cuando solicites una devolución o reembolso, el historial aparecerá en esta sección."
            action={
              <button type="button" className="account-btn account-btn--solid" onClick={() => setModalOpen(true)}>
                Solicitar reembolso
              </button>
            }
          />
        ) : null}

        {!loading && refunds.length > 0 ? (
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id}>
                    <td>#{refund.order.orderNumber}</td>
                    <td>
                      <span className={`account-badge ${refundBadgeClass(refund.status)}`}>
                        {formatRefundStatus(refund.status)}
                      </span>
                    </td>
                    <td>{refund.reason}</td>
                    <td>{refund.amount != null ? formatPrice(Number(refund.amount)) : "—"}</td>
                    <td>{formatDate(refund.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <AccountModal title="Solicitar reembolso" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="account-form" onSubmit={handleSubmit}>
          <p className="account-form-hint">
            Solo puedes solicitar reembolso de pedidos <strong>pagados</strong> que ya estén en preparación,
            envío o entregados. Si el pago sigue pendiente, espera a que lo confirmemos.
          </p>

          {loadingEligibleOrders ? (
            <p className="account-loading">Cargando pedidos elegibles…</p>
          ) : null}

          {!loadingEligibleOrders && eligibleOrders.length > 0 ? (
            <label className="account-form-field">
              <span>Selecciona tu pedido</span>
              <select
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                required
              >
                <option value="">Elige un pedido</option>
                {eligibleOrders.map((order) => (
                  <option key={order.id} value={order.orderNumber}>
                    #{order.orderNumber} — {formatPrice(order.total)} ({order.statusLabel})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="account-form-field">
              <span>Número de pedido</span>
              <input
                type="text"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="Ej: NM-20260906-0006"
                required
              />
            </label>
          )}

          {!loadingEligibleOrders && eligibleOrders.length === 0 ? (
            <p className="account-form-message">
              No encontramos pedidos pagados elegibles en tu cuenta. Si el pago aún está pendiente, no
              podrás solicitar reembolso hasta confirmarlo.
            </p>
          ) : null}

          {selectedEligibleOrder ? (
            <p className="account-form-hint">
              Pedido #{selectedEligibleOrder.orderNumber} ·{" "}
              {selectedEligibleOrder.paymentStatusLabel ?? "Pagado"}
            </p>
          ) : null}
          <label className="account-form-field">
            <span>Motivo de la solicitud</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              minLength={10}
              required
              placeholder="Describe brevemente el motivo de tu solicitud."
            />
          </label>
          <div className="account-form-actions">
            <button type="button" className="account-btn" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="account-btn account-btn--solid" disabled={saving}>
              {saving ? "Enviando…" : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </AccountModal>
    </div>
  );
}
