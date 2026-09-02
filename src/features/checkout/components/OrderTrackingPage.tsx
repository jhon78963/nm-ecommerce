import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { OrderTrackingForm } from "@/features/checkout/components/OrderTrackingForm";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";

import "./order.css";

export function OrderTrackingPage() {
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
                {CHECKOUT_COPY.trackingPageTitle}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-lg">
          <OrderTrackingForm />
        </div>
      </div>
    </section>
  );
}
