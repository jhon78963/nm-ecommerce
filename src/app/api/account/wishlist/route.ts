import { NextResponse } from "next/server";

import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";
import { getStoreWarehouseId } from "@/lib/ecommerce-backend";

export async function GET() {
  try {
    const warehouseId = getStoreWarehouseId();
    return proxyAuthenticatedGateway(
      `/ecommerce/customer/wishlist?warehouse_id=${encodeURIComponent(warehouseId)}`,
      { method: "GET" },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar la wishlist.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const warehouseId = getStoreWarehouseId();
    const body = (await request.json()) as { items?: unknown[] };
    return proxyAuthenticatedGateway("/ecommerce/customer/wishlist", {
      method: "PUT",
      body: JSON.stringify({ ...body, warehouseId }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la wishlist.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  return proxyAuthenticatedGateway("/ecommerce/customer/wishlist", { method: "DELETE" });
}
