import { useCallback, useEffect, useRef, useState } from "react";

import type { StoredOrder } from "@/features/checkout/types/order.types";
import {
  cancelCheckoutOrder,
  chargeCulqiOrder,
  fetchPublicOrder,
  getOrderApiErrorMessage,
  trackOrder,
} from "@/features/checkout/services/order.service";
import {
  clearCulqiPendingCharge,
  getCulqiPendingCharge,
  isCulqiChargeInFlight,
  tryAcquireCulqiChargeLock,
} from "@/features/checkout/utils/culqi-pending-charge";
import { findOrder, saveOrder } from "@/features/checkout/utils/order-storage";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/constants";
import { executeRecaptcha } from "@/lib/recaptcha/client";

const PAYMENT_POLL_INTERVAL_MS = 2500;

function isEmailContact(contact: string): boolean {
  return contact.includes("@");
}

async function loadOrderSnapshot(orderNumber: string, contact: string): Promise<StoredOrder> {
  const normalizedContact = contact.trim();

  if (isEmailContact(normalizedContact)) {
    return fetchPublicOrder(orderNumber, normalizedContact);
  }

  const captchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.orderTrack);
  return trackOrder(orderNumber, normalizedContact, captchaToken);
}

interface UseLiveOrderSyncOptions {
  orderNumber: string;
  contact: string;
  enabled?: boolean;
  processPendingCharge?: boolean;
}

export function useLiveOrderSync({
  orderNumber,
  contact,
  enabled = true,
  processPendingCharge = false,
}: UseLiveOrderSyncOptions) {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const chargeStartedRef = useRef(false);

  const refreshOrder = useCallback(async (): Promise<StoredOrder | null> => {
    if (!orderNumber || !contact) {
      return null;
    }

    try {
      const result = await loadOrderSnapshot(orderNumber, contact);
      setOrder(result);
      saveOrder(result);
      return result;
    } catch {
      return null;
    }
  }, [contact, orderNumber]);

  useEffect(() => {
    if (!enabled || !orderNumber || !contact) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    const cachedOrder = findOrder(orderNumber, contact);
    if (cachedOrder) {
      setOrder(cachedOrder);
    }

    let cancelled = false;
    setIsLoading(true);
    setPaymentError(null);

    void (async () => {
      const latestOrder = (await refreshOrder()) ?? cachedOrder;
      const lookupEmail = latestOrder?.email ?? (isEmailContact(contact) ? contact : "");

      if (latestOrder?.paymentStatus === "paid" && lookupEmail) {
        clearCulqiPendingCharge(orderNumber, lookupEmail);
      }

      const pendingCharge =
        processPendingCharge && latestOrder?.paymentStatus === "pending"
          ? ((lookupEmail ? getCulqiPendingCharge(orderNumber, lookupEmail) : null)
            ?? (isEmailContact(contact) ? getCulqiPendingCharge(orderNumber, contact) : null))
          : null;

      const shouldProcessCharge =
        Boolean(pendingCharge)
        && !chargeStartedRef.current
        && tryAcquireCulqiChargeLock(pendingCharge!.orderNumber, pendingCharge!.email);

      if (shouldProcessCharge && pendingCharge) {
        chargeStartedRef.current = true;
        setIsProcessingPayment(true);

        try {
          const captchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.checkoutOrder);
          await chargeCulqiOrder({
            ...pendingCharge,
            captchaToken,
          });
          await refreshOrder();
        } catch (error) {
          const refreshed = await refreshOrder();

          if (refreshed?.paymentStatus === "paid") {
            setPaymentError(null);
          } else {
            setPaymentError(getOrderApiErrorMessage(error));

            if (refreshed?.paymentStatus === "pending") {
              try {
                const cancelCaptchaToken = await executeRecaptcha(RECAPTCHA_ACTIONS.checkoutOrder);
                await cancelCheckoutOrder({
                  orderNumber: pendingCharge.orderNumber,
                  email: pendingCharge.email,
                  captchaToken: cancelCaptchaToken,
                });
              } catch {
                // El backend también intenta revertir si el cargo falla.
              }

              await refreshOrder();
            }
          }
        } finally {
          clearCulqiPendingCharge(pendingCharge.orderNumber, pendingCharge.email);
          if (!cancelled) {
            setIsProcessingPayment(false);
          }
        }
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [contact, enabled, orderNumber, processPendingCharge, refreshOrder]);

  useEffect(() => {
    if (!enabled || !orderNumber || !contact || !order) {
      return;
    }

    if (order.paymentMethodId !== "culqi" || order.paymentStatus !== "pending") {
      return;
    }

    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled) {
        return;
      }

      void (async () => {
        try {
          const result = await loadOrderSnapshot(orderNumber, contact);
          if (!cancelled) {
            setOrder(result);
            saveOrder(result);

            if (result.paymentStatus === "paid") {
              clearCulqiPendingCharge(result.orderNumber, result.email);
            }
          }
        } catch {
          // Mantener el último estado conocido.
        }
      })();
    }, PAYMENT_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [contact, enabled, order, orderNumber]);

  const lookupEmail = order?.email || (isEmailContact(contact) ? contact : "");
  const isAwaitingPayment =
    order?.paymentMethodId === "culqi"
    && order.paymentStatus === "pending"
    && (isProcessingPayment
      || isCulqiChargeInFlight(orderNumber, lookupEmail)
      || (processPendingCharge && Boolean(getCulqiPendingCharge(orderNumber, lookupEmail))));

  return {
    order,
    isLoading,
    isProcessingPayment,
    isAwaitingPayment,
    paymentError,
  };
}
