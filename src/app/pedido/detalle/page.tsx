import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailsPage } from "@/features/checkout/components/OrderDetailsPage";

export const metadata: Metadata = {
  title: "Detalle del pedido",
  description: "Consulta el detalle de tu pedido en Novedades Maritex.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderDetailsPage />
    </Suspense>
  );
}
