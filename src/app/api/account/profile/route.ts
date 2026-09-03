import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyGatewayJson, readUpstreamError } from "@/lib/gateway-backend";

async function requireToken() {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return { error: NextResponse.json({ message: "Sesión no válida." }, { status: 401 }) };
  }

  return { accessToken };
}

export async function PATCH(request: Request) {
  const auth = await requireToken();
  if ("error" in auth) return auth.error;

  const body = await request.text();
  const response = await proxyGatewayJson("/auth/customer/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    return NextResponse.json(
      {
        message: text
          ? await readUpstreamError(new Response(text, { status: response.status }))
          : "Error",
      },
      { status: response.status },
    );
  }

  return new NextResponse(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
