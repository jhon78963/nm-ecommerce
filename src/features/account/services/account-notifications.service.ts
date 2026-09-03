import type {
  CustomerNotification,
  CustomerNotificationSettings,
} from "@/features/account/types/account.types";

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchCustomerNotifications(): Promise<CustomerNotification[]> {
  const response = await fetch("/api/account/notifications");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar las notificaciones."));
  }

  return response.json() as Promise<CustomerNotification[]>;
}

export async function fetchNotificationSettings(): Promise<CustomerNotificationSettings> {
  const response = await fetch("/api/account/notification-settings");
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron cargar las preferencias."));
  }

  return response.json() as Promise<CustomerNotificationSettings>;
}

export async function updateNotificationSettings(
  payload: Partial<Pick<CustomerNotificationSettings, "orderUpdates" | "promotions" | "newsletter">>,
) {
  const response = await fetch("/api/account/notification-settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron guardar las preferencias."));
  }

  return response.json() as Promise<CustomerNotificationSettings>;
}

export async function markNotificationRead(id: string) {
  const response = await fetch(`/api/account/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudo marcar la notificación."));
  }

  return response.json() as Promise<CustomerNotification>;
}

export async function markAllNotificationsRead() {
  const response = await fetch("/api/account/notifications", { method: "POST" });
  if (!response.ok) {
    throw new Error(await parseError(response, "No se pudieron marcar las notificaciones."));
  }
}
