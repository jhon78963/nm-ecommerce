"use server";

import {
  clearCustomerAuthTokens,
  getCustomerAccessToken,
  setCustomerAuthTokens,
} from "@/features/customer-auth/utils/customer-auth-cookies";
import type { CustomerUser } from "@/features/customer-auth/types/customer-auth.types";
import {
  getAuthErrorMessage,
  getCustomerProfile,
  loginCustomer,
  registerCustomer,
} from "@/features/customer-auth/services/customer-auth.service";

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

  try {
    const data = await registerCustomer({ name, email, password });
    await setCustomerAuthTokens(data.access_token, data.refresh_token);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error, "No se pudo crear la cuenta."),
    };
  }
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

  try {
    const data = await loginCustomer({ email, password });
    await setCustomerAuthTokens(data.access_token, data.refresh_token);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error, "Credenciales incorrectas."),
    };
  }
}

export async function logoutCustomerAction() {
  await clearCustomerAuthTokens();
}

export async function getCurrentCustomerAction(): Promise<CustomerUser | null> {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    return await getCustomerProfile(accessToken);
  } catch {
    await clearCustomerAuthTokens();
    return null;
  }
}

export async function getCustomerAccessTokenAction() {
  return getCustomerAccessToken();
}
