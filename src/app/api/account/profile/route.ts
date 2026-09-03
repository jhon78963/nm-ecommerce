import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function PATCH(request: Request) {
  return proxyAuthenticatedGateway("/auth/customer/me", {
    method: "PATCH",
    body: await request.text(),
  });
}
