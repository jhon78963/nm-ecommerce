import { apiGet, apiPost, HttpError } from "@/services/http-client";

import type {
  CustomerAuthResponse,
  CustomerUser,
} from "@/features/customer-auth/types/customer-auth.types";

export async function registerCustomer(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost<CustomerAuthResponse>("auth/customer/register", payload);
}

export async function loginCustomer(payload: { email: string; password: string }) {
  return apiPost<CustomerAuthResponse>("auth/customer/login", payload);
}

export async function getCustomerProfile(accessToken: string) {
  return apiGet<CustomerUser>("auth/customer/me", { token: accessToken });
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HttpError) {
    return error.message || fallback;
  }

  return fallback;
}
