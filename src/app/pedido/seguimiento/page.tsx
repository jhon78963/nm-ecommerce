import type { Metadata } from "next";

import { OrderTrackingPage } from "@/features/checkout/components/OrderTrackingPage";

export const metadata: Metadata = {
  title: "Seguimiento de pedido",
  description: "Consulta el estado de tu pedido en Novedades Maritex.",
};

export default function Page() {
  return <OrderTrackingPage />;
}
