import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function GET() {
  return proxyAuthenticatedGateway("/ecommerce/customer/notification-settings", {
    method: "GET",
  });
}

export async function PATCH(request: Request) {
  return proxyAuthenticatedGateway("/ecommerce/customer/notification-settings", {
    method: "PATCH",
    body: await request.text(),
  });
}
