import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function proxyAddress(
  request: Request,
  context: RouteContext,
  method: "PATCH" | "DELETE",
) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Sesión no válida." }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await proxyEcommerceJson(`/ecommerce/customer/addresses/${encodeURIComponent(id)}`, {
    method,
    headers: { Authorization: `Bearer ${accessToken}` },
    ...(method === "PATCH" ? { body: await request.text() } : {}),
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

export async function PATCH(request: Request, context: RouteContext) {
  return proxyAddress(request, context, "PATCH");
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyAddress(request, context, "DELETE");
}
