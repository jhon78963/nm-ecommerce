"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthProvider";

export function HeaderUserMenu() {
  const { isAuthenticated, openLogin } = useAuth();

  if (isAuthenticated) {
    return (
      <Link
        href="/micuenta/miperfil"
        className="inline-flex items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
        aria-label="Mi cuenta"
      >
        <User className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openLogin()}
      className="inline-flex cursor-pointer items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
      aria-label="Iniciar sesión"
    >
      <User className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
    </button>
  );
}
