import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/features/auth/services/auth.service";
import { clearAuthCookies, getAccessToken } from "@/features/auth/utils/auth-cookies";

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const user = await getAuthenticatedUser(accessToken);
    return NextResponse.json(user);
  } catch {
    await clearAuthCookies();
    return NextResponse.json(null, { status: 401 });
  }
}
