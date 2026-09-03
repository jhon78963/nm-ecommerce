import type { PaymentMethodOption } from "@/features/checkout/types/checkout.types";

/** Orden y textos alineados con WooCommerce (deploy/woocommerce-payment-gateways.php). */
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "culqi",
    title: "Tarjetas, Yape y más (Culqi)",
    description: "Acepta pagos con tarjetas de débito y crédito, Yape.",
  },
  {
    id: "bacs",
    title: "Transferencia / Yape / Plin",
    description:
      "Paga por Yape, Plin o transferencia bancaria. Te enviaremos los datos al confirmar el pedido.",
  },
];
