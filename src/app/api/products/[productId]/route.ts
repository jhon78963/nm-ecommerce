import { NextResponse } from "next/server";

import { getProductsByIds } from "@/features/product/services/catalog.service";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  try {
    const products = await getProductsByIds([productId]);
    const product = products[0];

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json(
      { product },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar el producto.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
