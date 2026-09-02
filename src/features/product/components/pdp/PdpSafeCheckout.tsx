import { PDP_COPY } from "@/features/product/constants/pdp-copy";

/**
 * Sección de "Pago seguro garantizado".
 * Los íconos/logos de medios de pago se renderizarán aquí una vez que
 * el config del backend exponga las imágenes. Por ahora usa badges de texto.
 */
export function PdpSafeCheckout() {
  const methods = [
    { id: "visa", label: "Visa" },
    { id: "mastercard", label: "Mastercard" },
    { id: "yape", label: "Yape" },
    { id: "plin", label: "Plin" },
    { id: "efectivo", label: "Efectivo" },
  ];

  return (
    <div className="pdp-safe-checkout">
      <p className="pdp-safe-checkout__title">{PDP_COPY.safeCheckoutTitle}</p>
      <div className="pdp-payment-methods">
        {methods.map((method) => (
          <span
            key={method.id}
            className="inline-flex items-center rounded border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold tracking-wide text-gray-500 shadow-sm"
          >
            {method.label}
          </span>
        ))}
      </div>
    </div>
  );
}
