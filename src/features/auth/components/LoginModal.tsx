"use client";

import { useCallback, useEffect, useState } from "react";

import { AuthModalShell } from "@/features/auth/components/AuthModalShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { AuthModalView } from "@/features/auth/types/auth.types";

interface LoginModalProps {
  isOpen: boolean;
  message?: string | null;
  initialView?: AuthModalView;
  onClose: () => void;
  onLoginSuccess: () => void | Promise<void>;
}

export function LoginModal({
  isOpen,
  message,
  initialView = "login",
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [view, setView] = useState<AuthModalView>(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (!isOpen) {
      setView("login");
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLoginSuccess = useCallback(() => {
    void Promise.resolve(onLoginSuccess());
  }, [onLoginSuccess]);

  if (!isOpen) return null;

  return (
    <AuthModalShell onClose={onClose}>
      {message ? (
        <p className="mb-4 rounded border border-[#f0d9a8] bg-[#fffdf5] px-3 py-2.5 text-center text-sm text-[#7a6522]">
          {message}
        </p>
      ) : null}

      {view === "login" ? (
        <LoginForm onNavigate={setView} onSuccess={handleLoginSuccess} />
      ) : null}
      {view === "forgot-password" ? (
        <ForgotPasswordForm onNavigate={setView} />
      ) : null}
      {view === "register" ? (
        <RegisterForm onNavigate={setView} onSuccess={handleLoginSuccess} />
      ) : null}
    </AuthModalShell>
  );
}
