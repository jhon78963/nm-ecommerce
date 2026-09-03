import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;
  return proxyAuthenticatedGateway(
    `/ecommerce/orders/mine/${encodeURIComponent(orderNumber)}`,
    { method: "GET" },
  );
}
