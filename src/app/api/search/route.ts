import { NextResponse } from "next/server";

import { getSearchModalData } from "@/features/search/services/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const perPage = Number(searchParams.get("perPage") ?? 4);

  try {
    const data = await getSearchModalData({ q, perPage });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { products: [], collections: [], genders: [], query: q ?? "" },
      { status: 200 },
    );
  }
}
