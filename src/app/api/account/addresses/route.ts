import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function GET() {
  return proxyAuthenticatedGateway("/ecommerce/customer/addresses", { method: "GET" });
}

export async function POST(request: Request) {
  return proxyAuthenticatedGateway("/ecommerce/customer/addresses", {
    method: "POST",
    body: await request.text(),
  });
}
