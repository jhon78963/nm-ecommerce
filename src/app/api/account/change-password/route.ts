import { proxyAuthenticatedGateway } from "@/lib/account-api-proxy";

export async function PATCH(request: Request) {
  return proxyAuthenticatedGateway("/auth/customer/change-password", {
    method: "PATCH",
    body: await request.text(),
  });
}
