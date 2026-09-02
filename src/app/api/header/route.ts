import { NextResponse } from "next/server";

import { getStoreHeaderConfig } from "@/features/navigation/services/header.service";

export async function GET() {
  try {
    const config = await getStoreHeaderConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
