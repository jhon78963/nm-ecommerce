import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";

export function AccountAddresses() {
  return (
    <div className="account-card">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Libreta de direcciones</h2>
          <span className="account-coming-soon">Próximamente</span>
        </div>

        <AccountEmptyState
          title="Sin direcciones guardadas"
          description="Podrás guardar direcciones de envío y facturación para agilizar tus próximas compras."
        />

        <p className="account-integration-note">
          Integración pendiente: API de direcciones del cliente en ecommerce-service (CRUD
          vinculado al perfil autenticado).
        </p>
      </div>
    </div>
  );
}
