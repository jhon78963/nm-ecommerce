import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function readRevalidateSecret(): string | undefined {
  const value = process.env.REVALIDATE_SECRET;
  return value && value.trim() !== "" ? value : undefined;
}

export async function POST(request: Request) {
  const secret = readRevalidateSecret();
  if (!secret) {
    return NextResponse.json({ error: "Revalidation not configured" }, { status: 503 });
  }

  let body: { secret?: string; tag?: string };
  try {
    body = (await request.json()) as { secret?: string; tag?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.tag?.trim()) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  revalidateTag(body.tag.trim(), { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: body.tag.trim() });
}
