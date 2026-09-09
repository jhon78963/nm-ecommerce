"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-white px-6 text-[#222]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Algo salió mal</h1>
          <p className="mt-3 text-sm text-neutral-600">
            Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded bg-[#222] px-4 py-2 text-sm text-white"
            >
              Reintentar
            </button>
            <a href="/" className="rounded border border-[#222] px-4 py-2 text-sm">
              Ir al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
