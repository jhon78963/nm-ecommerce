"use client";

import { useCallback, useEffect, useState } from "react";

import { AuthModalShell } from "@/features/auth/components/AuthModalShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { AuthModalView } from "@/features/auth/types/auth.types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [view, setView] = useState<AuthModalView>("login");

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
    onLoginSuccess();
    onClose();
  }, [onClose, onLoginSuccess]);

  if (!isOpen) return null;

  return (
    <AuthModalShell onClose={onClose}>
      {view === "login" ? (
        <LoginForm onNavigate={setView} onSuccess={handleLoginSuccess} />
      ) : null}
      {view === "forgot-password" ? (
        <ForgotPasswordForm onNavigate={setView} />
      ) : null}
      {view === "register" ? <RegisterForm onNavigate={setView} /> : null}
    </AuthModalShell>
  );
}
