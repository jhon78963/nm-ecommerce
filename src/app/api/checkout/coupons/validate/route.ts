import { NextResponse } from "next/server";

import { env } from "@/config/env";
import { getClientIp } from "@/lib/client-ip";
import { proxyEcommerceJson } from "@/lib/ecommerce-backend";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      code?: string;
      subtotal?: number;
      customerId?: string;
    };

    const warehouseId = env.storeWarehouseId;
    if (!warehouseId) {
      return NextResponse.json({ message: "Tienda no configurada." }, { status: 500 });
    }

    const response = await proxyEcommerceJson("/ecommerce/coupons/validate", {
      method: "POST",
      body: JSON.stringify({
        code: body.code,
        subtotal: body.subtotal ?? 0,
        customerId: body.customerId,
        warehouseId,
        clientIp: getClientIp(request),
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "No se pudo validar el cupón." }, { status: 500 });
  }
}
