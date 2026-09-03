import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "10";

  return proxyAuthenticatedGateway(
    `/ecommerce/orders/mine?page=${encodeURIComponent(page)}&perPage=${encodeURIComponent(perPage)}`,
    { method: "GET" },
  );
}
