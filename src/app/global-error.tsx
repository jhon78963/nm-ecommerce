"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16 text-center font-sans text-[#222] antialiased">
        <h1 className="mb-2 text-2xl font-semibold">Algo salió mal</h1>
        <p className="mb-6 max-w-md text-sm text-[#777]">
          Ocurrió un error inesperado. Intenta recargar la página.
        </p>
        {process.env.NODE_ENV !== "production" && error.message ? (
          <pre className="mb-6 max-w-xl overflow-x-auto rounded bg-[#f8f8f8] p-4 text-left text-xs text-[#555]">
            {error.message}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="rounded bg-[#222] px-6 py-3 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
