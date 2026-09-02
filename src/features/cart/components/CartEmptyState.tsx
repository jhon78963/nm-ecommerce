import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { ROUTES } from "@/lib/routes";

export function CartEmptyState() {
  return (
    <div className="no-data-added flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-[#f8f8f8] text-theme">
        <ShoppingCart className="size-9 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-[#222]">{CART_COPY.emptyTitle}</h3>
      <p className="mt-2 max-w-md text-sm text-[#777]">{CART_COPY.emptyDescription}</p>
      <Link
        href={ROUTES.collection("ninos")}
        className="mt-6 inline-flex border border-theme bg-theme px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-theme"
      >
        {CART_COPY.exploreCollections}
      </Link>
    </div>
  );
}
