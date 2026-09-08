import { describe, expect, it } from "vitest";

import type { CustomerAddress } from "@/features/account/types/account.types";
import {
  addressPrefillChanged,
  buildCheckoutPrefillFromCustomer,
  mergeAddressPrefill,
  splitCustomerName,
} from "@/features/checkout/utils/checkout-customer-prefill";
import { createEmptyAddress } from "@/features/checkout/utils/address";

describe("checkout customer prefill", () => {
  it("splits customer names into first and last name", () => {
    expect(splitCustomerName("Maria Elena Perez")).toEqual({
      firstName: "Maria",
      lastName: "Elena Perez",
    });
  });

  it("builds checkout prefill from default customer address", () => {
    const address: CustomerAddress = {
      id: "addr-1",
      label: "Casa",
      firstName: "Juan",
      lastName: "Perez",
      country: "PE",
      address1: "Av. España 123",
      address2: "",
      city: "Trujillo",
      state: "LAL",
      postcode: "13001",
      phone: "999888777",
      isDefault: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    expect(buildCheckoutPrefillFromCustomer("Ignored Name", address)).toMatchObject({
      firstName: "Juan",
      lastName: "Perez",
      city: "Trujillo",
      postcode: "13001",
    });
  });

  it("merges prefill only into empty checkout fields", () => {
    const current = createEmptyAddress();

    const merged = mergeAddressPrefill(current, {
      firstName: "Ana",
      city: "Trujillo",
      phone: "999111222",
    });

    expect(merged.firstName).toBe("Ana");
    expect(merged.city).toBe("Trujillo");
    expect(addressPrefillChanged(current, merged)).toBe(true);
  });

  it("does not overwrite existing checkout values", () => {
    const current = {
      ...createEmptyAddress(),
      firstName: "Carlos",
      city: "Lima",
    };

    const merged = mergeAddressPrefill(current, {
      firstName: "Ana",
      city: "Trujillo",
    });

    expect(merged.firstName).toBe("Carlos");
    expect(merged.city).toBe("Lima");
    expect(addressPrefillChanged(current, merged)).toBe(false);
  });
});
