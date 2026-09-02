"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft } from "lucide-react";

import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthTitle } from "@/features/auth/components/AuthTitle";
import type { AuthModalView } from "@/features/auth/types/auth.types";

interface ForgotPasswordFormProps {
  onNavigate: (view: AuthModalView) => void;
}

const initialState = { success: false, message: null, error: null };

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
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

export function ForgotPasswordForm({ onNavigate }: ForgotPasswordFormProps) {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <>
      <button
        type="button"
        onClick={() => onNavigate("login")}
        className="modal-back absolute left-[clamp(18px,3vw,44px)] top-[clamp(18px,3vw,44px)] inline-flex items-center text-[19px] leading-none text-[#222] hover:text-theme"
        aria-label="Volver"
      >
        <ArrowLeft className="size-5" />
      </button>

      <AuthTitle title="¿Olvidaste tu contraseña?" />

      {state.error ? (
        <p className="mb-4 text-center text-sm font-medium text-red-600">{state.error}</p>
      ) : null}

      {state.message ? (
        <p className="mb-4 text-center text-sm font-medium text-green-700">{state.message}</p>
      ) : null}

      <form action={formAction} className="auth-form-box">
        <div className="auth-box mb-3">
          <label htmlFor="email" className={labelClassName}>
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Ingresa tu correo"
            className={inputClassName}
          />
        </div>

        <SubmitButton />
      </form>
    </>
  );
}
