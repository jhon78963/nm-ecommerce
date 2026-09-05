import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CUSTOMER_ACCESS_TOKEN = "nm_customer_access_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_ACCESS_TOKEN)?.value;
  if (token) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set("auth", "login");

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/micuenta/:path*"],
};
