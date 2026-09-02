"use client";

import { useState } from "react";

import { GoogleIcon } from "@/features/auth/components/GoogleIcon";
import { cn } from "@/lib/utils";

export type GoogleSignInIntent = "login" | "register";

interface GoogleSignInButtonProps {
  intent: GoogleSignInIntent;
  className?: string;
}

const LABELS: Record<GoogleSignInIntent, string> = {
  login: "Continuar con Google",
  register: "Registrarse con Google",
};

export function GoogleSignInButton({ intent, className }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    window.location.href = `/api/auth/google?intent=${intent}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "flex w-full items-center justify-center gap-3",
        "border border-[#eee] bg-white",
        "px-4 py-[clamp(11px,1.2vw,15px)]",
        "text-base font-semibold leading-tight text-[#222]",
        "transition-colors duration-200",
        "hover:border-theme hover:bg-[#fffaf7]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      aria-label={LABELS[intent]}
    >
      <GoogleIcon className="shrink-0" />
      <span>{isLoading ? "Conectando..." : LABELS[intent]}</span>
    </button>
  );
}
