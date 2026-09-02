"use client";

import { PERU_DEPARTMENTS } from "@/features/checkout/constants/peru-departments";
import { CHECKOUT_COPY } from "@/features/checkout/constants/checkout-copy";
import type { CheckoutAddress } from "@/features/checkout/types/checkout.types";

const inputClassName =
  "form-control w-full border border-[#eee] bg-white px-3 py-2.5 text-sm font-medium text-[#222] outline-none placeholder:text-[#999] focus:border-theme disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:text-[#999]";

const labelClassName = "form-label mb-1 block text-sm font-medium text-[#777]";

const errorClassName = "mt-1 text-xs text-red-600";

interface FieldErrors {
  [key: string]: string | undefined;
}

interface CheckoutAddressFieldsProps {
  prefix: string;
  address: CheckoutAddress;
  errors: FieldErrors;
  onChange: (field: keyof CheckoutAddress, value: string) => void;
  disabled?: boolean;
}

export function CheckoutAddressFields({
  prefix,
  address,
  errors,
  onChange,
  disabled = false,
}: CheckoutAddressFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${prefix}-firstName`} className={labelClassName}>
          {CHECKOUT_COPY.firstName} *
        </label>
        <input
          id={`${prefix}-firstName`}
          className={inputClassName}
          value={address.firstName}
          onChange={(event) => onChange("firstName", event.target.value)}
          autoComplete="given-name"
          disabled={disabled}
        />
        {errors.firstName ? <p className={errorClassName}>{errors.firstName}</p> : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-lastName`} className={labelClassName}>
          {CHECKOUT_COPY.lastName} *
        </label>
        <input
          id={`${prefix}-lastName`}
          className={inputClassName}
          value={address.lastName}
          onChange={(event) => onChange("lastName", event.target.value)}
          autoComplete="family-name"
          disabled={disabled}
        />
        {errors.lastName ? <p className={errorClassName}>{errors.lastName}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-country`} className={labelClassName}>
          {CHECKOUT_COPY.country} *
        </label>
        <select
          id={`${prefix}-country`}
          className={inputClassName}
          value={address.country}
          onChange={(event) => onChange("country", event.target.value)}
          autoComplete="country"
          disabled={disabled}
        >
          <option value="PE">Perú</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-address1`} className={labelClassName}>
          {CHECKOUT_COPY.address} *
        </label>
        <input
          id={`${prefix}-address1`}
          className={inputClassName}
          value={address.address1}
          onChange={(event) => onChange("address1", event.target.value)}
          autoComplete="street-address"
          disabled={disabled}
        />
        {errors.address1 ? <p className={errorClassName}>{errors.address1}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-address2`} className={labelClassName}>
          {CHECKOUT_COPY.address2}
        </label>
        <input
          id={`${prefix}-address2`}
          className={inputClassName}
          value={address.address2}
          onChange={(event) => onChange("address2", event.target.value)}
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor={`${prefix}-city`} className={labelClassName}>
          {CHECKOUT_COPY.city} *
        </label>
        <input
          id={`${prefix}-city`}
          className={inputClassName}
          value={address.city}
          onChange={(event) => onChange("city", event.target.value)}
          autoComplete="address-level2"
          disabled={disabled}
        />
        {errors.city ? <p className={errorClassName}>{errors.city}</p> : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-state`} className={labelClassName}>
          {CHECKOUT_COPY.state} *
        </label>
        <select
          id={`${prefix}-state`}
          className={inputClassName}
          value={address.state}
          onChange={(event) => onChange("state", event.target.value)}
          autoComplete="address-level1"
          disabled={disabled}
        >
          <option value="">{CHECKOUT_COPY.selectDepartment}</option>
          {PERU_DEPARTMENTS.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.state ? <p className={errorClassName}>{errors.state}</p> : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-postcode`} className={labelClassName}>
          {CHECKOUT_COPY.postcode} *
        </label>
        <input
          id={`${prefix}-postcode`}
          className={inputClassName}
          value={address.postcode}
          onChange={(event) => onChange("postcode", event.target.value)}
          autoComplete="postal-code"
          disabled={disabled}
        />
        {errors.postcode ? <p className={errorClassName}>{errors.postcode}</p> : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-phone`} className={labelClassName}>
          {CHECKOUT_COPY.phone}
        </label>
        <input
          id={`${prefix}-phone`}
          type="tel"
          className={inputClassName}
          value={address.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          autoComplete="tel"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
