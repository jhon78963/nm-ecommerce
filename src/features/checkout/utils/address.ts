import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";

export function createEmptyAddress(): CheckoutAddress {
  return {
    firstName: "",
    lastName: "",
    country: "PE",
    address1: "",
    address2: "",
    city: "",
    state: "LAL",
    postcode: "",
    phone: "",
  };
}

export function formatAddress(address: CheckoutAddress): string {
  const parts = [
    `${address.address1}${address.address2 ? `, ${address.address2}` : ""}`,
    address.city,
    address.postcode,
  ].filter(Boolean);

  return parts.join(", ");
}

export function formatFullName(address: CheckoutAddress): string {
  return `${address.firstName} ${address.lastName}`.trim();
}
