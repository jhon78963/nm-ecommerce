"use client";

import { useEffect, useState } from "react";

import { AccountEmptyState } from "@/features/account/components/AccountEmptyState";
import { AccountModal } from "@/features/account/components/AccountModal";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  fetchCustomerAddresses,
  updateCustomerAddress,
} from "@/features/account/services/account-addresses.service";
import type { CustomerAddress, CustomerAddressInput } from "@/features/account/types/account.types";
import { useAuth } from "@/features/auth/context/AuthProvider";

const EMPTY_FORM: CustomerAddressInput = {
  label: "Principal",
  firstName: "",
  lastName: "",
  country: "PE",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  phone: "",
  isDefault: false,
};

function toForm(address?: CustomerAddress): CustomerAddressInput {
  if (!address) return { ...EMPTY_FORM };

  return {
    label: address.label,
    firstName: address.firstName,
    lastName: address.lastName,
    country: address.country,
    address1: address.address1,
    address2: address.address2 ?? "",
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    phone: address.phone ?? "",
    isDefault: address.isDefault,
  };
}

export function AccountAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerAddressInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadAddresses = () => {
    setLoading(true);
    setError(null);

    fetchCustomerAddresses()
      .then(setAddresses)
      .catch((err: unknown) => {
        setAddresses([]);
        setError(err instanceof Error ? err.message : "No se pudieron cargar las direcciones.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openCreate = () => {
    const [firstName = "", ...rest] = (user?.name ?? "").split(" ");
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      firstName,
      lastName: rest.join(" "),
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEdit = (address: CustomerAddress) => {
    setEditingId(address.id);
    setForm(toForm(address));
    setModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        await updateCustomerAddress(editingId, form);
      } else {
        await createCustomerAddress(form);
      }

      setModalOpen(false);
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la dirección.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address: CustomerAddress) => {
    if (!window.confirm(`¿Eliminar la dirección "${address.label}"?`)) return;

    setError(null);
    try {
      await deleteCustomerAddress(address.id);
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la dirección.");
    }
  };

  const updateField = (field: keyof CustomerAddressInput, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="account-card">
      <div className="account-card__body">
        <div className="account-card__top">
          <h2>Libreta de direcciones</h2>
          <button type="button" className="account-btn account-btn--solid" onClick={openCreate}>
            + Agregar dirección
          </button>
        </div>

        {loading ? <p className="account-loading">Cargando direcciones…</p> : null}
        {error ? <p className="account-form-message account-form-message--error">{error}</p> : null}

        {!loading && addresses.length === 0 ? (
          <AccountEmptyState
            title="Sin direcciones guardadas"
            description="Guarda direcciones de envío y facturación para agilizar tus próximas compras."
            action={
              <button type="button" className="account-btn account-btn--solid" onClick={openCreate}>
                Agregar dirección
              </button>
            }
          />
        ) : null}

        {!loading && addresses.length > 0 ? (
          <div className="account-address-grid">
            {addresses.map((address) => (
              <article key={address.id} className="account-address-card">
                <h4>
                  {address.label}
                  {address.isDefault ? <span className="account-address-default">Predeterminada</span> : null}
                </h4>
                <p>
                  {address.firstName} {address.lastName}
                </p>
                <p>
                  {address.address1}
                  {address.address2 ? `, ${address.address2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} {address.postcode}
                </p>
                <p>{address.country}</p>
                {address.phone ? <p>Tel: {address.phone}</p> : null}
                <div className="account-address-actions">
                  <button type="button" className="account-link-button" onClick={() => openEdit(address)}>
                    Editar
                  </button>
                  <button type="button" className="account-link-button account-link-button--danger" onClick={() => handleDelete(address)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <AccountModal
        title={editingId ? "Editar dirección" : "Nueva dirección"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form className="account-form" onSubmit={handleSubmit}>
          <label className="account-form-field">
            <span>Etiqueta</span>
            <input
              type="text"
              value={form.label ?? ""}
              onChange={(event) => updateField("label", event.target.value)}
              placeholder="Casa, Trabajo…"
            />
          </label>
          <div className="account-form-grid">
            <label className="account-form-field">
              <span>Nombre</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                required
              />
            </label>
            <label className="account-form-field">
              <span>Apellidos</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                required
              />
            </label>
          </div>
          <label className="account-form-field">
            <span>Dirección</span>
            <input
              type="text"
              value={form.address1}
              onChange={(event) => updateField("address1", event.target.value)}
              required
            />
          </label>
          <label className="account-form-field">
            <span>Referencia (opcional)</span>
            <input
              type="text"
              value={form.address2 ?? ""}
              onChange={(event) => updateField("address2", event.target.value)}
            />
          </label>
          <div className="account-form-grid">
            <label className="account-form-field">
              <span>Ciudad</span>
              <input
                type="text"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                required
              />
            </label>
            <label className="account-form-field">
              <span>Departamento</span>
              <input
                type="text"
                value={form.state}
                onChange={(event) => updateField("state", event.target.value)}
                required
              />
            </label>
          </div>
          <div className="account-form-grid">
            <label className="account-form-field">
              <span>Código postal</span>
              <input
                type="text"
                value={form.postcode}
                onChange={(event) => updateField("postcode", event.target.value)}
                required
              />
            </label>
            <label className="account-form-field">
              <span>Teléfono</span>
              <input
                type="tel"
                value={form.phone ?? ""}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
          </div>
          <label className="account-form-checkbox">
            <input
              type="checkbox"
              checked={Boolean(form.isDefault)}
              onChange={(event) => updateField("isDefault", event.target.checked)}
            />
            <span>Usar como dirección predeterminada</span>
          </label>
          <div className="account-form-actions">
            <button type="button" className="account-btn" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="account-btn account-btn--solid" disabled={saving}>
              {saving ? "Guardando…" : "Guardar dirección"}
            </button>
          </div>
        </form>
      </AccountModal>
    </div>
  );
}
