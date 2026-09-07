import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface CulqiChargeBody {
  orderNumber?: string;
  email?: string;
  culqiToken?: string;
  captchaToken?: string;
}

export async function POST(request: Request) {
  let body: CulqiChargeBody;

  try {
    body = (await request.json()) as CulqiChargeBody;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const email = body.email?.trim();
  const culqiToken = body.culqiToken?.trim();

  if (!orderNumber || !email || !culqiToken) {
    return NextResponse.json(
      { message: "Faltan datos para procesar el pago." },
      { status: 400 },
    );
  }

  const response = await proxyEcommerceJson("/ecommerce/payments/culqi/charge", {
    method: "POST",
    body: JSON.stringify({
      orderNumber,
      email,
      culqiToken,
      ...(body.captchaToken ? { captchaToken: body.captchaToken } : {}),
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    const message = text
      ? await readUpstreamError(new Response(text, { status: response.status }))
      : "No pudimos procesar el pago.";

    return NextResponse.json({ message }, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
