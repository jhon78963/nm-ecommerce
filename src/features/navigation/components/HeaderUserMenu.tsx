"use client";

import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";

interface HeaderUserMenuProps {
  isAuthenticated?: boolean;
}

export function HeaderUserMenu({ isAuthenticated = false }: HeaderUserMenuProps) {
  return (
    <div className="group relative inline-flex items-center">
      <Link
        href={isAuthenticated ? "/micuenta/miperfil" : "/login"}
        className="inline-flex items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
        aria-label={isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
      >
        <User className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      </Link>

      <div
        className={cn(
          "invisible absolute right-0 top-full z-50 min-w-[160px]",
          "translate-y-8 bg-white px-5 py-4 opacity-0 shadow-[0_1px_2px_0_#cacaca]",
          "transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <ul className="space-y-1">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  href="/micuenta/miperfil"
                  className="flex items-center gap-2 py-1 text-[15px] capitalize text-[#333] hover:text-theme"
                >
                  <User className="size-4" />
                  Mi perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/micuenta/pedidos"
                  className="flex items-center gap-2 py-1 text-[15px] capitalize text-[#333] hover:text-theme"
                >
                  Mis pedidos
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 py-1 text-left text-[15px] capitalize text-[#333] hover:text-theme"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="flex items-center gap-2 py-1 text-[15px] capitalize text-[#333] hover:text-theme"
              >
                <LogIn className="size-4" />
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
