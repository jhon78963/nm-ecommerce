"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronRight } from "lucide-react";

import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { AuthTitle } from "@/features/auth/components/AuthTitle";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { PASSWORD_HINT } from "@/features/auth/utils/password.validation";

const initialState = { success: false, error: null };

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
      {pending ? "Guardando..." : "Restablecer contraseña"}
    </button>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { openLogin } = useAuth();
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  if (!token) {
    return (
      <div className="rounded border border-[#f0d9a8] bg-[#fffdf5] px-4 py-5 text-center">
        <h1 className="mb-2 text-lg font-semibold text-[#222]">Enlace no válido</h1>
        <p className="mb-4 text-sm text-[#6a6a6a]">
          El enlace de recuperación está incompleto o ya no es válido. Solicita uno nuevo desde
          el inicio de sesión.
        </p>
        <button
          type="button"
          onClick={() => openLogin({ initialView: "forgot-password" })}
          className="cursor-pointer text-sm font-semibold text-theme hover:underline"
        >
          Solicitar nuevo enlace
        </button>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="rounded border border-[#b8e6c5] bg-[#f4fff7] px-4 py-5 text-center">
        <h1 className="mb-2 text-lg font-semibold text-[#222]">Contraseña actualizada</h1>
        <p className="mb-4 text-sm text-[#6a6a6a]">
          Tu contraseña se restableció correctamente. Ya puedes iniciar sesión con tu nueva
          contraseña.
        </p>
        <button
          type="button"
          onClick={() => openLogin()}
          className="btn rounded-none border-0 bg-theme px-5 py-2.5 text-sm font-semibold text-white"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <AuthTitle
        title="Restablecer contraseña"
        description="Ingresa tu nueva contraseña. El enlace expira en 60 minutos."
      />

      {state.error ? (
        <p className="mb-4 text-center text-sm font-medium text-red-600">{state.error}</p>
      ) : null}

      <form action={formAction} className="auth-form-box">
        <input type="hidden" name="token" value={token} />

        <div className="auth-box mb-3">
          <label htmlFor="password" className={labelClassName}>
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Ingresa tu nueva contraseña"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-[#888]">{PASSWORD_HINT}</p>
        </div>

        <div className="auth-box mb-3">
          <label htmlFor="password-confirmation" className={labelClassName}>
            Confirmar contraseña
          </label>
          <input
            id="password-confirmation"
            name="password_confirmation"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Confirma tu nueva contraseña"
            className={inputClassName}
          />
        </div>

        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-[#6a6a6a]">
        <button
          type="button"
          onClick={() => openLogin({ initialView: "forgot-password" })}
          className="cursor-pointer font-medium text-theme hover:underline"
        >
          Solicitar un nuevo enlace
        </button>
      </p>
    </>
  );
}

export function ResetPasswordPage() {
  return (
    <section className="pb-[70px] pt-0">
      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#777]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-theme">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span className="font-medium text-[#222]" aria-current="page">
                Restablecer contraseña
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-md rounded border border-[#eee] bg-white px-[clamp(18px,4vw,28px)] py-[clamp(24px,4vw,36px)] shadow-sm">
          <Suspense
            fallback={
              <p className="text-center text-sm text-[#6a6a6a]">Cargando formulario…</p>
            }
          >
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
