import type {
  CustomerAddress,
  CustomerAddressInput,
} from "@/features/account/types/account.types";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchCustomerAddresses(): Promise<CustomerAddress[]> {
  const response = await fetch("/api/account/addresses");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar las direcciones."));
  }

  return response.json() as Promise<CustomerAddress[]>;
}

export async function createCustomerAddress(payload: CustomerAddressInput) {
  const response = await fetch("/api/account/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo guardar la dirección."));
  }

  return response.json() as Promise<CustomerAddress>;
}

export async function updateCustomerAddress(id: string, payload: CustomerAddressInput) {
  const response = await fetch(`/api/account/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo actualizar la dirección."));
  }

  return response.json() as Promise<CustomerAddress>;
}

export async function deleteCustomerAddress(id: string) {
  const response = await fetch(`/api/account/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo eliminar la dirección."));
  }
}
