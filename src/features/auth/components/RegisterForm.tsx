"use client";

import { useState } from "react";

import { AuthSocialSection } from "@/features/auth/components/AuthSocialSection";
import { AuthTitle } from "@/features/auth/components/AuthTitle";
import type { AuthModalView } from "@/features/auth/types/auth.types";

interface RegisterFormProps {
  onNavigate: (view: AuthModalView) => void;
}

const inputClassName =
  "form-control w-full border border-[#eee] px-[clamp(13px,1.5vw,19px)] py-[clamp(10px,1.2vw,12px)] text-sm font-medium text-[#222] outline-none placeholder:text-[#777] focus:border-theme";

const labelClassName = "form-label mb-1 block text-[15px] font-medium text-[#777]";

export function RegisterForm({ onNavigate }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("El registro en línea estará disponible próximamente. Contáctanos para crear tu cuenta.");
  };

  return (
    <>
      <AuthTitle title="Crear cuenta" />

      {error ? (
        <p className="mb-4 text-center text-sm font-medium text-amber-800">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="auth-form-box">
        <div className="auth-box form-box mb-3">
          <label htmlFor="name" className={labelClassName}>
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Nombre"
            className={inputClassName}
          />
        </div>

        <div className="auth-box form-box mb-3">
          <label htmlFor="register-email" className={labelClassName}>
            Correo electrónico
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            required
            placeholder="Correo electrónico"
            className={inputClassName}
          />
        </div>

        <div className="auth-box form-box mb-3">
          <label htmlFor="register-password" className={labelClassName}>
            Contraseña
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Ingresa tu contraseña"
            className={inputClassName}
          />
        </div>

        <div className="auth-box form-box mb-3">
          <label htmlFor="password-confirmation" className={labelClassName}>
            Confirmar contraseña
          </label>
          <input
            id="password-confirmation"
            name="password_confirmation"
            type="password"
            required
            minLength={8}
            placeholder="Confirmar contraseña"
            className={inputClassName}
          />
        </div>

        <label className="mb-3 flex items-start gap-2 text-sm text-[#6a6a6a]">
          <input type="checkbox" required className="mt-1" />
          <span>
            Acepto los <span className="font-semibold text-[#222]">términos</span> y la{" "}
            <span className="font-semibold text-[#222]">privacidad</span>
          </span>
        </label>

        <button
          type="submit"
          className="btn w-full rounded-none border-0 bg-theme px-4 py-[clamp(11px,1.2vw,15px)] text-base font-semibold leading-tight text-white"
        >
          Crear cuenta
        </button>
      </form>

      <AuthSocialSection intent="register" />

      <p className="create m-0 mt-[clamp(14px,2vw,25px)] text-center text-sm font-medium leading-relaxed text-[#333]">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="cursor-pointer font-semibold text-[#222] hover:text-theme"
        >
          Inicia sesión aquí
        </button>
      </p>
    </>
  );
}
