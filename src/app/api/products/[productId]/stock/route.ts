import { NextResponse } from "next/server";

import { fetchProductStockFromBackend } from "@/features/product/services/product-stock.service";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  try {
    const data = await fetchProductStockFromBackend(productId);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo consultar el stock.";
    const status = message.includes("no encontrado") ? 404 : 500;
    return NextResponse.json({ message }, { status });
  }
}
