import { NextResponse } from "next/server";

import { getCustomerAccessToken, getCustomerRefreshToken, setCustomerAuthTokens } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";
import { proxyGatewayJson } from "@/lib/gateway-backend";

async function refreshCustomerAccessToken(): Promise<string | null> {
  const refreshToken = await getCustomerRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await proxyGatewayJson("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  try {
    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };
    await setCustomerAuthTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch {
    return null;
  }
}

async function proxyWithToken(
  path: string,
  init: RequestInit,
  accessToken: string,
): Promise<Response> {
  const isEcommercePath = path.startsWith("/ecommerce/");
  const proxyFn = isEcommercePath ? proxyEcommerceJson : proxyGatewayJson;

  return proxyFn(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });
}

export async function proxyAuthenticatedGateway(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  let accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  let response = await proxyWithToken(path, init, accessToken);

  if (response.status === 401) {
    const refreshed = await refreshCustomerAccessToken();
    if (refreshed) {
      accessToken = refreshed;
      response = await proxyWithToken(path, init, accessToken);
    }
  }

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
