import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderConfirmationPage } from "@/features/checkout/components/OrderConfirmationPage";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  description: "Tu pedido ha sido registrado en Novedades Maritex.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
