import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyAuthenticatedGateway(`/ecommerce/customer/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: await request.text(),
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyAuthenticatedGateway(`/ecommerce/customer/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
