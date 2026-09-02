import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";

import "./checkout.css";

export function CheckoutPage() {
  return (
    <section className="checkout-section-2 pb-[70px] pt-0">
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
                {CHECKOUT_COPY.breadcrumbCurrent}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-xl font-bold text-[#222] md:text-3xl">{CHECKOUT_COPY.pageTitle}</h1>
          <p className="mt-2 text-sm text-[#777]">{CHECKOUT_COPY.pageDescription}</p>
        </div>

        <CheckoutForm />
      </div>
    </section>
  );
}
