import type { Metadata } from "next";

import { CheckoutPage } from "@/features/checkout/components/CheckoutPage";
import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Checkout",
  "Finaliza tu compra en Novedades Maritex.",
);

export default function Page() {
  return <CheckoutPage />;
}
