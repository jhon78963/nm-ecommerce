import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const { orderNumber } = await context.params;
  const response = await proxyEcommerceJson(
    `/ecommerce/orders/mine/${encodeURIComponent(orderNumber)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const text = await response.text();
  if (!response.ok) {
    return NextResponse.json(
      { message: text ? await readUpstreamError(new Response(text, { status: response.status })) : "Error" },
      { status: response.status },
    );
  }

  return new NextResponse(text, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
