import { NextResponse } from "next/server";

import {
  getCustomerAccessToken,
  getCustomerRefreshToken,
  setCustomerAuthTokens,
} from "@/features/customer-auth/utils/customer-auth-cookies";
import { getEcommerceServiceBaseUrl, readUpstreamError } from "@/lib/ecommerce-backend";
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

async function proxyInvoiceWithToken(
  path: string,
  accessToken: string,
): Promise<Response> {
  const baseUrl = getEcommerceServiceBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${baseUrl}${normalizedPath}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/pdf",
    },
    cache: "no-store",
  });
}

export async function proxyAuthenticatedInvoice(path: string): Promise<NextResponse> {
  let accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  let response = await proxyInvoiceWithToken(path, accessToken);

  if (response.status === 401) {
    const refreshed = await refreshCustomerAccessToken();
    if (refreshed) {
      accessToken = refreshed;
      response = await proxyInvoiceWithToken(path, accessToken);
    }
  }

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      {
        message: text
          ? await readUpstreamError(new Response(text, { status: response.status }))
          : "No se pudo descargar el comprobante.",
      },
      { status: response.status },
    );
  }

  const buffer = await response.arrayBuffer();
  const disposition =
    response.headers.get("content-disposition")
    ?? 'attachment; filename="comprobante.pdf"';

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
    },
  });
}
