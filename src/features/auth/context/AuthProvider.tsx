"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { logoutCustomerAction } from "@/features/customer-auth/actions/customer-auth.actions";
import type { CustomerUser } from "@/features/customer-auth/types/customer-auth.types";
import { LoginModal } from "@/features/auth/components/LoginModal";

interface AuthContextValue {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

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
      openLogin,
      closeLogin,
      refreshUser,
      logout,
    }),
    [user, isLoading, isLoginOpen, openLogin, closeLogin, refreshUser, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onLoginSuccess={refreshUser}
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
