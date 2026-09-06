import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface TrackOrderBody {
  orderNumber?: string;
  contact?: string;
  captchaToken?: string;
}

export async function POST(request: Request) {
  let body: TrackOrderBody;

  try {
    body = (await request.json()) as TrackOrderBody;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const contact = body.contact?.trim();
  const captchaToken = body.captchaToken?.trim();

  if (!orderNumber || !contact) {
    return NextResponse.json(
      { message: "Número de pedido y contacto son obligatorios." },
      { status: 400 },
    );
  }

  const response = await proxyEcommerceJson("/ecommerce/orders/track", {
    method: "POST",
    body: JSON.stringify({
      orderNumber,
      contact,
      ...(captchaToken ? { captchaToken } : {}),
    }),
  });

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
