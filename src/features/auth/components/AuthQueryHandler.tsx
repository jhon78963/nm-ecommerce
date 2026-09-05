"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";

export function AuthQueryHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin, refreshUser } = useAuth();

  useEffect(() => {
    const auth = searchParams.get("auth");
    const authSuccess = searchParams.get("auth_success");
    const authError = searchParams.get("auth_error");

    if (auth === "login") {
      openLogin({ initialView: "login" });
    }

    if (authSuccess) {
      void refreshUser();
    }

    if (authError) {
      openLogin({
        initialView: authError === "google_denied" ? "login" : "login",
        message: "No pudimos completar el inicio de sesión con Google. Intenta con tu correo.",
      });
    }

    if (!auth && !authSuccess && !authError) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    params.delete("auth_success");
    params.delete("auth_error");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [openLogin, pathname, refreshUser, router, searchParams]);

  return null;
}
