"use server";

import {
  clearCustomerAccessToken,
  getCustomerAccessToken,
  setCustomerAccessToken,
} from "@/features/customer-auth/utils/customer-auth-cookies";
import type {
  CustomerAuthResponse,
  CustomerUser,
} from "@/features/customer-auth/types/customer-auth.types";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function registerCustomerAction(
  _prevState: { success: boolean; error: string | null },
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (!name || !email || !password) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (password.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (password !== passwordConfirmation) {
    return { success: false, error: "Las contraseñas no coinciden." };
  }

  const response = await proxyEcommerceJson("/ecommerce/customers/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    return { success: false, error: await readUpstreamError(response) };
  }

  const data = (await response.json()) as CustomerAuthResponse;
  await setCustomerAccessToken(data.access_token);

  return { success: true, error: null };
}

export async function loginCustomerAction(
  _prevState: { success: boolean; error: string | null },
  formData: FormData,
) {
  const email = String(formData.get("email") ?? formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, error: "Correo y contraseña son obligatorios." };
  }

  const response = await proxyEcommerceJson("/ecommerce/customers/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { success: false, error: await readUpstreamError(response) };
  }

  const data = (await response.json()) as CustomerAuthResponse;
  await setCustomerAccessToken(data.access_token);

  return { success: true, error: null };
}

export async function logoutCustomerAction() {
  await clearCustomerAccessToken();
}

export async function getCurrentCustomerAction(): Promise<CustomerUser | null> {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return null;
  }

  const response = await proxyEcommerceJson("/ecommerce/customers/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    await clearCustomerAccessToken();
    return null;
  }

  return (await response.json()) as CustomerUser;
}

export async function getCustomerAccessTokenAction() {
  return getCustomerAccessToken();
}
