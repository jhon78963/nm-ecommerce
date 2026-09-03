import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";

export function AccountRefunds() {
  return (
    <div className="account-card">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Historial de reembolsos</h2>
          <span className="account-coming-soon">Próximamente</span>
        </div>

        <AccountEmptyState
          title="Sin reembolsos"
          description="Cuando solicites una devolución o reembolso, el historial aparecerá en esta sección."
        />

        <p className="account-integration-note">
          Integración pendiente: módulo de solicitudes de reembolso/devolución vinculado a pedidos
          ecommerce.
        </p>
      </div>
    </div>
  );
}
