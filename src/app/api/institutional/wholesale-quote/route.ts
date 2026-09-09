import { NextResponse } from "next/server";

import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const upstream = await proxyEcommerceJson("/ecommerce/institutional/wholesale-quote", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: await readUpstreamError(upstream) },
        { status: upstream.status },
      );
    }

    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json(
      { error: "No pudimos registrar tu solicitud mayorista." },
      { status: 500 },
    );
  }
}
