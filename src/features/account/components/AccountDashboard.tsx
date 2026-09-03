"use client";

import { useState } from "react";

import { AccountModal } from "@/features/account/components/AccountModal";
import {
  changeCustomerPassword,
  updateCustomerProfile,
} from "@/features/account/services/account-profile.service";
import { useAuth } from "@/features/auth/context/AuthProvider";

export function AccountDashboard() {
  const { user, refreshUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openProfileModal = () => {
    setName(user?.name ?? "");
    setError(null);
    setMessage(null);
    setProfileOpen(true);
  };

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setMessage(null);
    setPasswordOpen(true);
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await updateCustomerProfile(name.trim());
      await refreshUser();
      setMessage("Perfil actualizado correctamente.");
      setProfileOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setSaving(false);
      return;
    }

    try {
      await changeCustomerPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordOpen(false);
      await logout();
      setMessage("Contraseña actualizada. Inicia sesión nuevamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-dashboard">
      <div className="account-welcome">
        <h2>Hola, {user?.name ?? "cliente"}</h2>
        <p>Bienvenido a tu panel. Aquí puedes revisar tu información y gestionar tus pedidos.</p>
      </div>

      {message ? <p className="account-form-message account-form-message--success">{message}</p> : null}

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
                <span className="account-field-note">No editable</span>
              </div>
              <div>
                <h4>Contraseña</h4>
                <p>●●●●●●●●</p>
                <button type="button" className="account-link-button" onClick={openPasswordModal}>
                  Cambiar contraseña
                </button>
              </div>
            </div>
            <div className="account-profile-actions">
              <button type="button" className="account-btn account-btn--solid" onClick={openProfileModal}>
                Editar nombre
              </button>
            </div>
          </div>
        </div>
      </div>

      <AccountModal title="Editar nombre" isOpen={profileOpen} onClose={() => setProfileOpen(false)}>
        <form className="account-form" onSubmit={handleProfileSubmit}>
          <label className="account-form-field">
            <span>Nombre completo</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={255}
            />
          </label>
          <label className="account-form-field">
            <span>Correo electrónico</span>
            <input type="email" value={user?.email ?? ""} disabled readOnly />
          </label>
          {error ? <p className="account-form-message account-form-message--error">{error}</p> : null}
          <div className="account-form-actions">
            <button type="button" className="account-btn" onClick={() => setProfileOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="account-btn account-btn--solid" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </AccountModal>

      <AccountModal title="Cambiar contraseña" isOpen={passwordOpen} onClose={() => setPasswordOpen(false)}>
        <form className="account-form" onSubmit={handlePasswordSubmit}>
          <label className="account-form-field">
            <span>Contraseña actual</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <label className="account-form-field">
            <span>Nueva contraseña</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label className="account-form-field">
            <span>Confirmar nueva contraseña</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <p className="account-form-hint">
            Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.
          </p>
          {error ? <p className="account-form-message account-form-message--error">{error}</p> : null}
          <div className="account-form-actions">
            <button type="button" className="account-btn" onClick={() => setPasswordOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="account-btn account-btn--solid" disabled={saving}>
              {saving ? "Guardando…" : "Actualizar contraseña"}
            </button>
          </div>
        </form>
      </AccountModal>
    </div>
  );
}
