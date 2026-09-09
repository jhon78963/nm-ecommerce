import { proxyAuthenticatedInvoice } from "@/lib/account-invoice-proxy";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;
  return proxyAuthenticatedInvoice(
    `/ecommerce/orders/mine/${encodeURIComponent(orderNumber)}/invoice`,
  );
}
