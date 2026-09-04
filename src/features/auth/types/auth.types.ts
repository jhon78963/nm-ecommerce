export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  warehouseId?: string;
  tenantId?: string;
  profile?: {
    name?: string;
    avatar?: string;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthMessageResponse {
  message: string;
}

export type AuthModalView = "login" | "forgot-password" | "register";

export interface OpenLoginOptions {
  message?: string;
  initialView?: AuthModalView;
}

export interface LoginActionState {
  success: boolean;
  error: string | null;
}

export interface ForgotPasswordActionState {
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordActionState {
  success: boolean;
  error: string | null;
}
