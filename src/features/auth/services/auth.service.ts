import { apiGet, apiPost } from "@/services/http-client";

import type {
  AuthMessageResponse,
  AuthTokens,
  AuthUser,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from "@/features/auth/types/auth.types";

export async function loginUser(credentials: LoginCredentials) {
  return apiPost<AuthTokens>("auth/login", credentials);
}

export async function getAuthenticatedUser(accessToken: string) {
  return apiGet<AuthUser>("auth/me", { token: accessToken });
}

export async function logoutUser(accessToken: string) {
  return apiPost<void>("auth/logout", {}, { token: accessToken });
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  return apiPost<AuthMessageResponse>("auth/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiPost<void>("auth/reset-password", payload);
}

export async function loginWithGoogle(idToken: string) {
  return apiPost<AuthTokens>("auth/google", { id_token: idToken });
}
