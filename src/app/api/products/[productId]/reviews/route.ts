import { createProductReview, fetchProductReviews } from "@/features/product/services/product-reviews.service";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  try {
    const data = await fetchProductReviews(productId);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar las reseñas.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { productId } = await context.params;

  try {
    const body = (await request.json()) as { rating?: number; description?: string };
    const data = await createProductReview(productId, {
      rating: Number(body.rating),
      description: String(body.description ?? ""),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo publicar la reseña.";
    const status = message.includes("sesión") ? 401 : 400;
    return NextResponse.json({ message }, { status });
  }
}
