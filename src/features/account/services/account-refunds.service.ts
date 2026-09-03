import type { CustomerRefund } from "@/features/account/types/account.types";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchCustomerRefunds(): Promise<CustomerRefund[]> {
  const response = await fetch("/api/account/refunds");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar los reembolsos."));
  }

  return response.json() as Promise<CustomerRefund[]>;
}

export async function createRefundRequest(payload: { orderNumber: string; reason: string }) {
  const response = await fetch("/api/account/refunds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo registrar la solicitud."));
  }

  return response.json() as Promise<CustomerRefund>;
}
