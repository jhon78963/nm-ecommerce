import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import type { GoogleSignInIntent } from "@/features/auth/components/GoogleSignInButton";
import {
  buildGoogleAuthUrl,
  setGoogleOAuthCookies,
} from "@/features/auth/utils/google-oauth";
import { env } from "@/config/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const intent = searchParams.get("intent") === "register" ? "register" : "login";

  if (!env.googleClientId || !env.googleClientSecret) {
    const redirectUrl = new URL("/", env.appUrl);
    redirectUrl.searchParams.set("auth_error", "google_not_configured");
    return NextResponse.redirect(redirectUrl);
  }

  const state = randomBytes(24).toString("hex");
  await setGoogleOAuthCookies(state, intent as GoogleSignInIntent);

  return NextResponse.redirect(buildGoogleAuthUrl(state));
}
