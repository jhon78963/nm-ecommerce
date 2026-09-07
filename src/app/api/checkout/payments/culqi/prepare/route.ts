import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

interface CulqiPrepareBody {
  orderNumber?: string;
  email?: string;
  captchaToken?: string;
}

export async function POST(request: Request) {
  let body: CulqiPrepareBody;

  try {
    body = (await request.json()) as CulqiPrepareBody;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const email = body.email?.trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { message: "Faltan datos para iniciar el pago." },
      { status: 400 },
    );
  }

  const response = await proxyEcommerceJson("/ecommerce/payments/culqi/prepare", {
    method: "POST",
    body: JSON.stringify({
      orderNumber,
      email,
      ...(body.captchaToken ? { captchaToken: body.captchaToken } : {}),
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    const message = text
      ? await readUpstreamError(new Response(text, { status: response.status }))
      : "No pudimos iniciar el pago.";

    return NextResponse.json({ message }, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
