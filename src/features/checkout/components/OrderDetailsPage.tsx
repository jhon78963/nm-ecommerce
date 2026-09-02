"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { StoreImage } from "@/components/ui/StoreImage";
import { formatPrice } from "@/features/cart/utils/format-price";
import { OrderStatusTracker } from "@/features/checkout/components/OrderStatusTracker";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import { getDepartmentName } from "@/features/checkout/constants/peru-departments";
import type { StoredOrder } from "@/features/checkout/types/order.types";
import { formatAddress, formatFullName } from "@/features/checkout/utils/address";
import { trackOrder } from "@/features/checkout/services/order.service";
import { ROUTES } from "@/lib/routes";

import "./order.css";

export function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const orderNumber = searchParams.get("order_number") ?? "";
  const emailOrPhone = searchParams.get("email_or_phone") ?? "";

  useEffect(() => {
    if (!orderNumber || !emailOrPhone) {
      setOrder(null);
      setIsHydrated(true);
      return;
    }

    let cancelled = false;

    trackOrder(orderNumber, emailOrPhone)
      .then((result) => {
        if (!cancelled) {
          setOrder(result);
          setIsHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrder(null);
          setIsHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [emailOrPhone, orderNumber]);

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

      <OrderStatusTracker order={order} />

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
              <p>{order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}</p>
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
