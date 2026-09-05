"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-16 text-center">
      <h1 className="mb-2 text-2xl font-semibold text-[#222]">No pudimos cargar la página</h1>
      <p className="mb-6 max-w-md text-sm text-[#777]">
        Hubo un problema al conectar con el servidor. Intenta de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded bg-theme px-6 py-3 text-sm font-semibold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
