"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CartTable } from "@/features/cart/components/CartTable";
import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { useCart } from "@/features/cart/context/CartProvider";

export function CartPageContent() {
  const { items, isHydrated } = useCart();
  const showHeader = isHydrated && items.length > 0;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#777]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-theme">
              {CART_COPY.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <span className="font-medium text-[#222]" aria-current="page">
              {CART_COPY.breadcrumbCurrent}
            </span>
          </li>
        </ol>
      </nav>

      {showHeader ? (
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-xl font-bold text-[#222] md:text-3xl">{CART_COPY.pageTitle}</h1>
          <p className="mt-2 text-sm text-[#777]">{CART_COPY.pageDescription}</p>
        </div>
      ) : null}

      <CartTable />
    </>
  );
}
