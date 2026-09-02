"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import type { StoredOrder } from "@/features/checkout/types/order.types";
import { getOrderByNumber } from "@/features/checkout/utils/order-storage";
import { ROUTES } from "@/lib/routes";

import "./order.css";

export function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const orderNumber = searchParams.get("order_number") ?? "";

  useEffect(() => {
    setOrder(orderNumber ? getOrderByNumber(orderNumber) : null);
    setIsHydrated(true);
  }, [orderNumber]);

  if (!isHydrated) {
    return null;
  }

  if (!order) {
    return (
      <div className="order-empty-state">
        <h2>{CHECKOUT_COPY.orderNotFound}</h2>
        <p>{CHECKOUT_COPY.orderNotFoundDescription}</p>
        <Link href={ROUTES.orderTracking} className="btn btn-solid mt-4 inline-block">
          {CHECKOUT_COPY.track}
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="order-confirmation__icon">
        <CheckCircle2 className="size-16 text-theme" />
      </div>
      <h1>{CHECKOUT_COPY.confirmationTitle}</h1>
      <p>{CHECKOUT_COPY.confirmationDescription}</p>

      <div className="order-confirmation__number">
        <span>{CHECKOUT_COPY.confirmationOrderNumber}</span>
        <strong>#{order.orderNumber}</strong>
      </div>

      <div className="order-confirmation__steps">
        <h3>{CHECKOUT_COPY.confirmationNextSteps}</h3>
        {order.paymentMethodId === "bacs" ? <p>{CHECKOUT_COPY.confirmationBacs}</p> : null}
        <p>
          Puedes hacer seguimiento de tu pedido con tu número de orden y correo o teléfono.
        </p>
      </div>

      <div className="order-confirmation__actions">
        <Link
          href={`${ROUTES.orderDetails}?order_number=${encodeURIComponent(order.orderNumber)}&email_or_phone=${encodeURIComponent(order.email)}`}
          className="btn btn-solid"
        >
          {CHECKOUT_COPY.viewOrder}
        </Link>
        <Link href={ROUTES.orderTracking} className="btn btn-outline">
          {CHECKOUT_COPY.trackAnother}
        </Link>
      </div>
    </div>
  );
}

export function OrderConfirmationPage() {
  return (
    <section className="order-section pb-[70px] pt-0">
      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#777]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-theme">
                {CHECKOUT_COPY.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span className="font-medium text-[#222]" aria-current="page">
                {CHECKOUT_COPY.confirmationTitle}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-2xl">
          <OrderConfirmationContent />
        </div>
      </div>
    </section>
  );
}
