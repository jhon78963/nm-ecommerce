import { NextResponse } from "next/server";

import { loginCustomerWithGoogle } from "@/features/customer-auth/services/customer-auth.service";
import {
  setCustomerAuthTokens,
} from "@/features/customer-auth/utils/customer-auth-cookies";
import {
  clearGoogleOAuthCookies,
  exchangeGoogleCode,
  getGoogleOAuthCookies,
} from "@/features/auth/utils/google-oauth";
import { env } from "@/config/env";
import { HttpError } from "@/services/http-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const redirectUrl = new URL("/", env.appUrl);

  if (oauthError) {
    redirectUrl.searchParams.set("auth_error", "google_denied");
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    redirectUrl.searchParams.set("auth_error", "google_invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const stored = await getGoogleOAuthCookies();
  await clearGoogleOAuthCookies();

  if (!stored.state || stored.state !== state) {
    redirectUrl.searchParams.set("auth_error", "google_state");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const googleTokens = await exchangeGoogleCode(code);
    const session = await loginCustomerWithGoogle(googleTokens.id_token);
    await setCustomerAuthTokens(session.access_token, session.refresh_token);

    if (stored.intent === "register") {
      redirectUrl.searchParams.set("auth_success", "registered");
    } else {
      redirectUrl.searchParams.set("auth_success", "login");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      redirectUrl.searchParams.set("auth_error", "google_backend_pending");
      return NextResponse.redirect(redirectUrl);
    }

    redirectUrl.searchParams.set("auth_error", "google_failed");
    return NextResponse.redirect(redirectUrl);
  }
}
