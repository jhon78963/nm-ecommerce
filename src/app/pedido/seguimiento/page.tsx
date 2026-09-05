import type { Metadata } from "next";

import { OrderTrackingPage } from "@/features/checkout/components/OrderTrackingPage";
import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Seguimiento de pedido",
  "Consulta el estado de tu pedido en Novedades Maritex.",
);

export default function Page() {
  return <OrderTrackingPage />;
}
