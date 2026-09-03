"use client";

import { useEffect, useState } from "react";

import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";
import {
  fetchCustomerNotifications,
  fetchNotificationSettings,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationSettings,
} from "@/features/account/services/account-notifications.service";
import type {
  CustomerNotification,
  CustomerNotificationSettings,
} from "@/features/account/types/account.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AccountNotifications() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [settings, setSettings] = useState<CustomerNotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    Promise.all([fetchCustomerNotifications(), fetchNotificationSettings()])
      .then(([items, prefs]) => {
        setNotifications(items);
        setSettings(prefs);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "No se pudieron cargar las notificaciones.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleSetting = async (
    key: keyof Pick<CustomerNotificationSettings, "orderUpdates" | "promotions" | "newsletter">,
  ) => {
    if (!settings) return;

    const nextValue = !settings[key];
    setSavingKey(key);
    setError(null);

    try {
      const updated = await updateNotificationSettings({ [key]: nextValue });
      setSettings(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar las preferencias.");
    } finally {
      setSavingKey(null);
    }
  };

  const handleMarkRead = async (notification: CustomerNotification) => {
    if (notification.readAt) return;

    try {
      const updated = await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo marcar la notificación.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron marcar las notificaciones.");
    }
  };

  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <div className="account-card">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Notificaciones</h2>
          {unreadCount > 0 ? (
            <button type="button" className="account-link-button" onClick={handleMarkAllRead}>
              Marcar todas como leídas
            </button>
          ) : null}
        </div>

        {settings ? (
          <div className="account-info-box account-notification-settings">
            <h3>Preferencias</h3>
            <label className="account-form-checkbox">
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                disabled={savingKey === "orderUpdates"}
                onChange={() => toggleSetting("orderUpdates")}
              />
              <span>Actualizaciones de pedidos</span>
            </label>
            <label className="account-form-checkbox">
              <input
                type="checkbox"
                checked={settings.promotions}
                disabled={savingKey === "promotions"}
                onChange={() => toggleSetting("promotions")}
              />
              <span>Promociones y ofertas</span>
            </label>
            <label className="account-form-checkbox">
              <input
                type="checkbox"
                checked={settings.newsletter}
                disabled={savingKey === "newsletter"}
                onChange={() => toggleSetting("newsletter")}
              />
              <span>Novedades de la tienda</span>
            </label>
          </div>
        ) : null}

        {loading ? <p className="account-loading">Cargando notificaciones…</p> : null}
        {error ? <p className="account-form-message account-form-message--error">{error}</p> : null}

        {!loading && notifications.length === 0 ? (
          <AccountEmptyState
            title="No tienes notificaciones"
            description="Aquí verás avisos sobre el estado de tus pedidos, promociones y novedades de la tienda."
          />
        ) : null}

        {!loading && notifications.length > 0 ? (
          <ul className="account-notification-list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={notification.readAt ? "" : "is-unread"}
                onClick={() => handleMarkRead(notification)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void handleMarkRead(notification);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
