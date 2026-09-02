import {
  STORE_CURRENCY,
  STORE_LOCALE,
} from "@/features/navigation/constants/top-bar";

export function formatPrice(amount: number, currency = STORE_CURRENCY) {
  return new Intl.NumberFormat(STORE_LOCALE, {
    style: "currency",
    currency,
  }).format(amount);
}
