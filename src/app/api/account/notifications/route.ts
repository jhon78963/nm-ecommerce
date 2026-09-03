import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

async function proxyCustomerAccount(
  path: string,
  init: RequestInit,
): Promise<NextResponse> {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const response = await proxyEcommerceJson(path, {
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

export async function GET() {
  return proxyCustomerAccount("/ecommerce/customer/notifications", { method: "GET" });
}

export async function POST() {
  return proxyCustomerAccount("/ecommerce/customer/notifications/read-all", {
    method: "POST",
  });
}
