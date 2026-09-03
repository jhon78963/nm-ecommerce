import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyGatewayJson, readUpstreamError } from "@/lib/gateway-backend";

export async function proxyAuthenticatedGateway(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const response = await proxyGatewayJson(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
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

  if (response.status === 204 || !text) {
    return new NextResponse(null, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
