import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailsPage } from "@/features/checkout/components/OrderDetailsPage";
import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Detalle del pedido",
  "Consulta el detalle de tu pedido en Novedades Maritex.",
);

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderDetailsPage />
    </Suspense>
  );
}
