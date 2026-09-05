import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderConfirmationPage } from "@/features/checkout/components/OrderConfirmationPage";
import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Pedido confirmado",
  "Tu pedido ha sido registrado en Novedades Maritex.",
);

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
