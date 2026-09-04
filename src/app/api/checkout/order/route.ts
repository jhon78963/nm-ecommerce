import { NextResponse } from "next/server";

import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { getClientIp } from "@/lib/client-ip";
import {
  getStoreWarehouseId,
  proxyEcommerceJson,
  readUpstreamError,
} from "@/lib/ecommerce-backend";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  let warehouseId: string;
  try {
    warehouseId = getStoreWarehouseId();
  } catch {
    return NextResponse.json(
      { message: "La tienda no está configurada correctamente." },
      { status: 500 },
    );
  }

  const accessToken = await getCustomerAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await proxyEcommerceJson("/ecommerce/orders", {
    method: "POST",
    body: JSON.stringify({ ...payload, warehouseId, clientIp: getClientIp(request) }),
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    const message = text
      ? await readUpstreamError(new Response(text, { status: response.status }))
      : "No pudimos procesar tu pedido. Intenta nuevamente.";

    return NextResponse.json({ message }, { status: response.status });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
