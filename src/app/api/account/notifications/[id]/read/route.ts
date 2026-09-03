import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyAuthenticatedGateway(
    `/ecommerce/customer/notifications/${encodeURIComponent(id)}/read`,
    { method: "PATCH" },
  );
}
