"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { loginAction } from "@/features/auth/actions/auth.actions";
import { AuthSocialSection } from "@/features/auth/components/AuthSocialSection";
import { AuthTitle } from "@/features/auth/components/AuthTitle";
import type { AuthModalView, LoginActionState } from "@/features/auth/types/auth.types";

interface LoginFormProps {
  onNavigate: (view: AuthModalView) => void;
  onSuccess: () => void;
}

const initialState: LoginActionState = { success: false, error: null };

const inputClassName =
  "form-control w-full border border-[#eee] px-[clamp(13px,1.5vw,19px)] py-[clamp(10px,1.2vw,12px)] text-sm font-medium text-[#222] outline-none placeholder:text-[#777] focus:border-theme";

const labelClassName = "form-label mb-1 block text-[15px] font-medium text-[#777]";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn mt-1 w-full rounded-none border-0 bg-theme px-4 py-[clamp(11px,1.2vw,15px)] text-base font-semibold leading-tight text-white disabled:opacity-60"
    >
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export function LoginForm({ onNavigate, onSuccess }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) onSuccess();
  }, [onSuccess, state.success]);

  return (
    <>
      <AuthTitle title="Ingresar" />

      {state.error ? (
        <p className="mb-4 text-center text-sm font-medium text-red-600">{state.error}</p>
      ) : null}

      <form action={formAction} className="auth-form-box">
        <div className="auth-box mb-3">
          <label htmlFor="username" className={labelClassName}>
            Correo electrónico
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="Correo electrónico"
            className={inputClassName}
          />
        </div>

        <div className="auth-box mb-3">
          <label htmlFor="password" className={labelClassName}>
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => onNavigate("forgot-password")}
            className="forgot mt-[5px] block w-full cursor-pointer text-right text-sm font-medium text-[#777] hover:text-theme"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <SubmitButton />
      </form>

      <AuthSocialSection intent="login" />

      <p className="create m-0 mt-[clamp(14px,2vw,25px)] text-center text-sm font-medium leading-relaxed text-[#333]">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => onNavigate("register")}
          className="cursor-pointer font-semibold text-[#222] hover:text-theme"
        >
          Regístrate aquí
        </button>
      </p>
    </>
  );
}
