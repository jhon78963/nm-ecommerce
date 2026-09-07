import type { PaymentMethodOption } from "@/features/checkout/types/checkout.types";

/** Orden y textos alineados con WooCommerce (deploy/woocommerce-payment-gateways.php). */
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "bacs",
    title: "Transferencia / Yape / Plin",
    description:
      "Paga por Yape, Plin o transferencia. Al confirmar verás el QR de Yape y cómo enviar tu comprobante.",
  },
  // Culqi: habilitar cuando esté integrada la pasarela de pagos.
  {
    id: "culqi",
    title: "Tarjetas, Yape y más (Culqi)",
    description: "Acepta tarjetas de débito y crédito, Yape.",
  },
];
