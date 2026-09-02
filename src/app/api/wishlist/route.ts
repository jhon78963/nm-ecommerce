import { NextResponse } from "next/server";

import { getWishlistProducts } from "@/features/wishlist/services/wishlist.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await getWishlistProducts(ids);
    const orderedProducts = ids
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

    return NextResponse.json({ products: orderedProducts });
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}
