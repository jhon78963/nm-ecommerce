export function formatPrice(amount: number, currency = "PEN") {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
  }).format(amount);
}
