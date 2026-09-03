import type { CustomerUser } from "@/features/customer-auth/types/customer-auth.types";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function updateCustomerProfile(name: string): Promise<CustomerUser> {
  const response = await fetch("/api/account/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo actualizar el perfil."));
  }

  return response.json() as Promise<CustomerUser>;
}

export async function changeCustomerPassword(payload: {
  current_password: string;
  new_password: string;
}) {
  const response = await fetch("/api/account/change-password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo cambiar la contraseña."));
  }
}
