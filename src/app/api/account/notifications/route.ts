import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function GET() {
  return proxyAuthenticatedGateway("/ecommerce/customer/notifications", { method: "GET" });
}

export async function POST() {
  return proxyAuthenticatedGateway("/ecommerce/customer/notifications/read-all", {
    method: "POST",
  });
}
