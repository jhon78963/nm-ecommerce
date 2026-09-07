"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";

import { StoreImage } from "@/components/ui/StoreImage";
import { formatPrice } from "@/features/cart/utils/format-price";
import { BacsPaymentInstructions } from "@/features/checkout/components/BacsPaymentInstructions";
import { OrderStatusSummary } from "@/features/checkout/components/OrderStatusSummary";
import { OrderStatusTracker } from "@/features/checkout/components/OrderStatusTracker";
import { PaymentStatusBadge } from "@/features/checkout/components/PaymentStatusBadge";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { getDepartmentName } from "@/features/checkout/constants/peru-departments";
import { useLiveOrderSync } from "@/features/checkout/hooks/use-live-order-sync";
import { formatAddress, formatFullName } from "@/features/checkout/utils/address";
import { useOrderLookupParams } from "@/features/checkout/utils/order-lookup-params";
import { ROUTES } from "@/lib/routes";

import "./order.css";

export function OrderDetailsContent() {
  const { orderNumber, emailOrPhone, email } = useOrderLookupParams();
  const contact = emailOrPhone || email;
  const { order, isLoading, isAwaitingPayment, paymentError } = useLiveOrderSync({
    orderNumber,
    contact,
    enabled: Boolean(orderNumber && contact),
    processPendingCharge: false,
  });

  if (isLoading && !order) {
    return (
      <div className="order-empty-state" aria-busy="true">
        <p>Cargando detalle del pedido...</p>
      </div>
    );
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
    <div className="order-details">
      <div className="order-details-header">
        <Link href={ROUTES.orderTracking} className="back-link">
          <ArrowLeft className="size-4" />
          {CHECKOUT_COPY.back}
        </Link>
        <h1>
          {CHECKOUT_COPY.orderNumber}: #{order.orderNumber}
        </h1>
      </div>

      {isAwaitingPayment ? (
        <p className="order-confirmation__processing">
          <Loader2 className="mr-2 inline size-4 animate-spin" aria-hidden="true" />
          {CHECKOUT_COPY.confirmationPaymentProcessing}
        </p>
      ) : null}

      {paymentError ? (
        <p className="order-confirmation__error" role="alert">
          {paymentError || CHECKOUT_COPY.confirmationPaymentFailed}
        </p>
      ) : null}

      <OrderStatusSummary order={order} />
      <OrderStatusTracker order={order} />

      {order.paymentMethodId === "bacs" && order.paymentStatus === "pending" ? (
        <div className="order-details__bacs-payment">
          <BacsPaymentInstructions orderNumber={order.orderNumber} total={order.total} />
        </div>
      ) : null}

      <div className="dashboard-table">
        <table className="order-table">
          <thead>
            <tr>
              <th>{CHECKOUT_COPY.image}</th>
              <th>{CHECKOUT_COPY.product}</th>
              <th>{CHECKOUT_COPY.price}</th>
              <th>{CHECKOUT_COPY.quantity}</th>
              <th>{CHECKOUT_COPY.lineTotal}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <StoreImage
                    src={item.imageUrl}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="order-product-image"
                  />
                </td>
                <td>
                  <h6>{item.name}</h6>
                  {item.variation ? <p className="variation">{item.variation}</p> : null}
                </td>
                <td>{formatPrice(item.price)}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-details">
        <div className="summary-card consumer-card">
          <h3>{CHECKOUT_COPY.consumerDetails}</h3>
          <ul>
            <li>
              <label>{CHECKOUT_COPY.billingAddress}</label>
              <p>
                {formatFullName(order.billing)}
                <br />
                {formatAddress(order.billing)}
                <br />
                {getDepartmentName(order.billing.state)}, Perú
                <br />
                {order.email}
                {order.billing.phone ? (
                  <>
                    <br />
                    {CHECKOUT_COPY.phone}: {order.billing.phone}
                  </>
                ) : null}
              </p>
            </li>
            <li>
              <label>{CHECKOUT_COPY.shippingAddress}</label>
              <p>
                {formatFullName(order.shipping)}
                <br />
                {formatAddress(order.shipping)}
                <br />
                {getDepartmentName(order.shipping.state)}, Perú
                {order.shipping.phone ? (
                  <>
                    <br />
                    {CHECKOUT_COPY.phone}: {order.shipping.phone}
                  </>
                ) : null}
              </p>
            </li>
            <li>
              <label>{CHECKOUT_COPY.shipping}</label>
              <p>{order.shippingMethodTitle}</p>
            </li>
            <li>
              <label>{CHECKOUT_COPY.paymentMode}</label>
              <p>{order.paymentMethodTitle}</p>
            </li>
            <li>
              <label>{CHECKOUT_COPY.paymentStatus}</label>
              <p>
                <PaymentStatusBadge
                  status={order.paymentStatus}
                  label={order.paymentStatusLabel}
                />
              </p>
            </li>
            {order.orderNotes ? (
              <li>
                <label>{CHECKOUT_COPY.orderNotes}</label>
                <p>{order.orderNotes}</p>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="summary-card totals-card">
          <h3>{CHECKOUT_COPY.summary}</h3>
          <ul>
            <li>
              {CHECKOUT_COPY.subtotal}
              <span>{formatPrice(order.subtotal)}</span>
            </li>
            <li>
              {CHECKOUT_COPY.shipping}
              <span>{formatPrice(order.shippingTotal)}</span>
            </li>
            {order.couponDiscount > 0 ? (
              <li>
                {CHECKOUT_COPY.couponDiscount}
                <span>-{formatPrice(order.couponDiscount)}</span>
              </li>
            ) : null}
            <li className="grand-total">
              {CHECKOUT_COPY.total}
              <span>{formatPrice(order.total)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OrderDetailsPage() {
  return (
    <section className="order-section user-dashboard-section pb-[70px] pt-0">
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
              <Link href={ROUTES.orderTracking} className="transition-colors hover:text-theme">
                {CHECKOUT_COPY.trackingPageTitle}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span className="font-medium text-[#222]" aria-current="page">
                {CHECKOUT_COPY.orderDetailsTitle}
              </span>
            </li>
          </ol>
        </nav>

        <OrderDetailsContent />
      </div>
    </section>
  );
}
