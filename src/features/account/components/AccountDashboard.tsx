"use client";

import { useAuth } from "@/features/auth/context/AuthProvider";

export function AccountDashboard() {
  const { user } = useAuth();

  return (
    <div className="account-dashboard">
      <div className="account-welcome">
        <h2>Hola, {user?.name ?? "cliente"}</h2>
        <p>Bienvenido a tu panel. Aquí puedes revisar tu información y gestionar tus pedidos.</p>
      </div>

      <div className="account-card">
        <div className="account-card__body">
          <div className="account-info-box">
            <h3>Información de la cuenta</h3>
            <ul className="account-info-list">
              <li>
                <strong>Nombre:</strong> {user?.name ?? "—"}
              </li>
              <li>
                <strong>Correo:</strong> {user?.email ?? "—"}
              </li>
            </ul>
          </div>

          <div className="account-info-box" style={{ marginTop: 16 }}>
            <h3>Datos de acceso</h3>
            <div className="account-login-details">
              <div>
                <h4>Correo electrónico</h4>
                <p>{user?.email}</p>
                <span className="account-coming-soon">Edición próximamente</span>
              </div>
              <div>
                <h4>Contraseña</h4>
                <p>●●●●●●●●</p>
                <span className="account-coming-soon">Cambio próximamente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
