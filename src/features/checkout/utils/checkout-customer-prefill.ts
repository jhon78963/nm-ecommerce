import type { CustomerAddress } from "@/features/account/types/account.types";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";

export function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function customerAddressToCheckout(address: CustomerAddress): CheckoutAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    country: address.country || "PE",
    address1: address.address1,
    address2: address.address2 ?? "",
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    phone: address.phone ?? "",
  };
}

export function mergeAddressPrefill(
  current: CheckoutAddress,
  prefill: Partial<CheckoutAddress>,
): CheckoutAddress {
  const next = { ...current };

  (Object.keys(prefill) as (keyof CheckoutAddress)[]).forEach((key) => {
    const value = prefill[key];
    if (typeof value !== "string" || !value.trim()) return;
    if (!current[key]?.trim()) {
      next[key] = value;
    }
  });

  return next;
}

export function addressPrefillChanged(before: CheckoutAddress, after: CheckoutAddress): boolean {
  return (Object.keys(before) as (keyof CheckoutAddress)[]).some((key) => before[key] !== after[key]);
}

export function buildCheckoutPrefillFromCustomer(
  name: string,
  defaultAddress: CustomerAddress | null,
): Partial<CheckoutAddress> {
  if (defaultAddress) {
    return customerAddressToCheckout(defaultAddress);
  }

  return splitCustomerName(name);
}
