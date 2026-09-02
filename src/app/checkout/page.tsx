import type { Metadata } from "next";

import { CheckoutPage } from "@/features/checkout/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu compra en Novedades Maritex.",
};

export default function Page() {
  return <CheckoutPage />;
}
