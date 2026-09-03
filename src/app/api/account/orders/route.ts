import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function GET(request: Request) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "10";

  const response = await proxyEcommerceJson(
    `/ecommerce/orders/mine?page=${page}&perPage=${perPage}`,
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
