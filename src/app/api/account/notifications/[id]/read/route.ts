import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await proxyEcommerceJson(
    `/ecommerce/customer/notifications/${encodeURIComponent(id)}/read`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

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
