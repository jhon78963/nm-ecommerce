import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";

export function AccountNotifications() {
  return (
    <div className="account-card">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Notificaciones</h2>
          <span className="account-coming-soon">Próximamente</span>
        </div>

        <AccountEmptyState
          title="No tienes notificaciones"
          description="Aquí verás avisos sobre el estado de tus pedidos, promociones y novedades de la tienda."
        />

        <p className="account-integration-note">
          Integración pendiente: servicio de notificaciones para clientes web (pedidos, envíos,
          promociones).
        </p>
      </div>
    </div>
  );
}
