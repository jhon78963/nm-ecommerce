"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { logoutCustomerAction } from "@/features/customer-auth/actions/customer-auth.actions";
import type { CustomerUser } from "@/features/customer-auth/types/customer-auth.types";
import { AuthQueryHandler } from "@/features/auth/components/AuthQueryHandler";
import { LoginModal } from "@/features/auth/components/LoginModal";
import type { AuthModalView, OpenLoginOptions } from "@/features/auth/types/auth.types";

interface AuthContextValue {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginOpen: boolean;
  loginModalMessage: string | null;
  openLogin: (options?: OpenLoginOptions) => void;
  closeLogin: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState<string | null>(null);
  const [loginModalInitialView, setLoginModalInitialView] = useState<AuthModalView>("login");

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/customer-auth/me");
      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = (await response.json()) as CustomerUser | null;
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const openLogin = useCallback((options?: OpenLoginOptions) => {
    setLoginModalMessage(options?.message ?? null);
    setLoginModalInitialView(options?.initialView ?? "login");
    setIsLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false);
    setLoginModalMessage(null);
    setLoginModalInitialView("login");
  }, []);

  const handleLoginSuccess = useCallback(async () => {
    await refreshUser();
    closeLogin();
  }, [closeLogin, refreshUser]);

  const logout = useCallback(async () => {
    await logoutCustomerAction();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isLoginOpen,
      loginModalMessage,
      openLogin,
      closeLogin,
      refreshUser,
      logout,
    }),
    [user, isLoading, isLoginOpen, loginModalMessage, openLogin, closeLogin, refreshUser, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      <Suspense fallback={null}>
        <AuthQueryHandler />
      </Suspense>
      {children}
      <LoginModal
        isOpen={isLoginOpen}
        message={loginModalMessage}
        initialView={loginModalInitialView}
        onClose={closeLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
