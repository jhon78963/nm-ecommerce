import { cookies } from "next/headers";

import type { GoogleSignInIntent } from "@/features/auth/components/GoogleSignInButton";

const STATE_COOKIE = "nm_google_oauth_state";
const INTENT_COOKIE = "nm_google_oauth_intent";

export function getGoogleRedirectUri() {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3015"}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function setGoogleOAuthCookies(state: string, intent: GoogleSignInIntent) {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  cookieStore.set(STATE_COOKIE, state, options);
  cookieStore.set(INTENT_COOKIE, intent, options);
}

export async function getGoogleOAuthCookies() {
  const cookieStore = await cookies();
  return {
    state: cookieStore.get(STATE_COOKIE)?.value,
    intent: cookieStore.get(INTENT_COOKIE)?.value as GoogleSignInIntent | undefined,
  };
}

export async function clearGoogleOAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(INTENT_COOKIE);
}

export async function exchangeGoogleCode(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Google authorization code");
  }

  return response.json() as Promise<{
    access_token: string;
    id_token: string;
    expires_in: number;
    token_type: string;
  }>;
}
