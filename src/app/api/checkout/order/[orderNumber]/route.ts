import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { message: "Número de pedido y correo son obligatorios." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({ email });
  const response = await proxyEcommerceJson(
    `/ecommerce/orders/public/${encodeURIComponent(orderNumber)}?${query.toString()}`,
  );

  const text = await response.text();

  if (!response.ok) {
    const message = text
      ? await readUpstreamError(new Response(text, { status: response.status }))
      : "Pedido no encontrado.";

    return NextResponse.json({ message }, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
