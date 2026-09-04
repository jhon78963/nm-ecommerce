"use server";

import {
  getAuthenticatedUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/services/auth.service";
import type {
  ForgotPasswordActionState,
  LoginActionState,
  ResetPasswordActionState,
} from "@/features/auth/types/auth.types";
import { isValidPassword } from "@/features/auth/utils/password.validation";
import {
  clearAuthCookies,
  getAccessToken,
  setAuthCookies,
} from "@/features/auth/utils/auth-cookies";
import { HttpError } from "@/services/http-client";

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { success: false, error: "Usuario y contraseña son obligatorios." };
  }

  try {
    const tokens = await loginUser({ username, password });
    await setAuthCookies(tokens.access_token, tokens.refresh_token);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return { success: false, error: "Credenciales incorrectas." };
    }

    if (error instanceof HttpError && error.status === 429) {
      return { success: false, error: "Demasiados intentos. Intenta más tarde." };
    }

    return { success: false, error: "No se pudo iniciar sesión. Intenta de nuevo." };
  }
}

export async function forgotPasswordAction(
  _prevState: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { success: false, message: null, error: "El correo es obligatorio." };
  }

  try {
    const response = await requestPasswordReset({ email });
    return {
      success: true,
      message: response.message,
      error: null,
    };
  } catch {
    return {
      success: true,
      message: "Si el correo existe, recibirás un enlace de recuperación.",
      error: null,
    };
  }
}

export async function resetPasswordAction(
  _prevState: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (!token) {
    return { success: false, error: "El enlace de recuperación no es válido." };
  }

  if (!password || !passwordConfirmation) {
    return { success: false, error: "Completa todos los campos." };
  }

  if (password !== passwordConfirmation) {
    return { success: false, error: "Las contraseñas no coinciden." };
  }

  if (!isValidPassword(password)) {
    return {
      success: false,
      error:
        "La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula, número y carácter especial.",
    };
  }

  try {
    await resetPassword({ token, password });
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        success: false,
        error: error.message || "No se pudo restablecer la contraseña. El enlace puede haber expirado.",
      };
    }

    return {
      success: false,
      error: "No se pudo restablecer la contraseña. Intenta de nuevo.",
    };
  }
}

export async function logoutAction() {
  const accessToken = await getAccessToken();

  if (accessToken) {
    try {
      await logoutUser(accessToken);
    } catch {
      // Clear local session even if backend logout fails.
    }
  }

  await clearAuthCookies();
}

export async function getCurrentUserAction() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    return await getAuthenticatedUser(accessToken);
  } catch {
    await clearAuthCookies();
    return null;
  }
}
