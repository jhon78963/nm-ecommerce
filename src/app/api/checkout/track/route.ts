import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const contact = searchParams.get("contact")?.trim();

  if (!orderNumber || !contact) {
    return NextResponse.json(
      { message: "Número de pedido y contacto son obligatorios." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({ orderNumber, contact });
  const response = await proxyEcommerceJson(`/ecommerce/orders/track?${query.toString()}`);

  const text = await response.text();

  if (!response.ok) {
    const message = text
      ? await readUpstreamError(new Response(text, { status: response.status }))
      : "No encontramos un pedido con esos datos.";

    return NextResponse.json({ message }, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
