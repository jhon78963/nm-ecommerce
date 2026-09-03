"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { useAuth } from "@/features/auth/context/AuthProvider";

import "./account.css";

interface AccountShellProps {
  children: ReactNode;
  title: string;
}

export function AccountShell({ children, title }: AccountShellProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, openLogin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin();
    }
  }, [isAuthenticated, isLoading, openLogin]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <section className="account-section">
        <div className="container account-container">
          <p className="account-loading">Cargando tu cuenta…</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="account-section">
        <div className="container account-container">
          <div className="account-guest-prompt">
            <h1>Inicia sesión para ver tu cuenta</h1>
            <p>Accede a tus pedidos, direcciones y preferencias.</p>
            <button type="button" className="btn btn-solid" onClick={openLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-section user-dashboard-section">
      <div className="container account-container">
        <div className="account-layout">
          <div className="account-layout__sidebar">
            <AccountSidebar
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onLogout={handleLogout}
            />
          </div>

          <div className="account-layout__content">
            <button
              type="button"
              className="account-show-menu btn"
              onClick={() => setIsMenuOpen(true)}
            >
              Mostrar menú
            </button>
            <div className="account-page-header">
              <h1>{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
