"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { registerCustomerAction } from "@/features/customer-auth/actions/customer-auth.actions";
import { AuthSocialSection } from "@/features/auth/components/AuthSocialSection";
import { AuthTitle } from "@/features/auth/components/AuthTitle";
import type { AuthModalView } from "@/features/auth/types/auth.types";
import { formatCouponDiscount } from "@/features/checkout/types/coupon.types";

interface RegisterFormProps {
  onNavigate: (view: AuthModalView) => void;
  onSuccess: () => void;
}

const inputClassName =
  "form-control w-full border border-[#eee] px-[clamp(13px,1.5vw,19px)] py-[clamp(10px,1.2vw,12px)] text-sm font-medium text-[#222] outline-none placeholder:text-[#777] focus:border-theme";

const labelClassName = "form-label mb-1 block text-[15px] font-medium text-[#777]";

export function RegisterForm({ onNavigate, onSuccess }: RegisterFormProps) {
  const [state, formAction] = useActionState(registerCustomerAction, {
    success: false,
    error: null,
    welcomeCoupon: null,
  });
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (!state.success) return;
    if (state.welcomeCoupon && !welcomeDismissed) return;
    onSuccess();
  }, [onSuccess, state.success, state.welcomeCoupon, welcomeDismissed]);

  if (state.success && state.welcomeCoupon && !welcomeDismissed) {
    const coupon = state.welcomeCoupon;

    return (
      <div className="text-center">
        <AuthTitle title="¡Bienvenido/a!" />
        <div className="mb-5 rounded-xl border border-[#f0d9a8] bg-[#fffdf5] px-4 py-5">
          <p className="mb-2 text-sm text-[#6a6a6a]">
            {coupon.description || "Te regalamos un cupón de bienvenida para tu primera compra."}
          </p>
          <p className="text-2xl font-bold tracking-[0.2em] text-[#222]">{coupon.code}</p>
          <p className="mt-2 text-sm font-medium text-theme">{formatCouponDiscount(coupon)}</p>
          <p className="mt-3 text-xs text-[#777]">Úsalo en el checkout al finalizar tu pedido.</p>
        </div>
        <button
          type="button"
          className="btn w-full rounded-none border-0 bg-theme px-4 py-[clamp(11px,1.2vw,15px)] text-base font-semibold leading-tight text-white"
          onClick={() => setWelcomeDismissed(true)}
        >
          Empezar a comprar
        </button>
      </div>
    );
  }

  return (
    <>
      <AuthTitle title="Crear cuenta" />

      {state.error ? (
        <p className="mb-4 text-center text-sm font-medium text-red-600">{state.error}</p>
      ) : null}

      <form action={formAction} className="auth-form-box">
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

        <SubmitButton />
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn w-full rounded-none border-0 bg-theme px-4 py-[clamp(11px,1.2vw,15px)] text-base font-semibold leading-tight text-white disabled:opacity-70"
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}
