import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyGatewayJson, readUpstreamError } from "@/lib/gateway-backend";

export async function PATCH(request: Request) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const body = await request.text();
  const response = await proxyGatewayJson("/auth/customer/change-password", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      {
        message: text
          ? await readUpstreamError(new Response(text, { status: response.status }))
          : "Error",
      },
      { status: response.status },
    );
  }

  return new NextResponse(null, { status: 204 });
}
