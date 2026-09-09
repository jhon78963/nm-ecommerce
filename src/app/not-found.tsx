import Link from "next/link";

import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-20 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-theme">404</p>
      <h1 className="mb-3 text-2xl font-semibold text-[#222]">Página no encontrada</h1>
      <p className="mb-8 max-w-md text-sm text-[#777]">
        El enlace puede estar roto o la página ya no existe. Vuelve al inicio o explora el catálogo.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded bg-theme px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Ir al inicio
        </Link>
        <Link
          href={ROUTES.search}
          className="rounded border border-[#ddd] px-6 py-3 text-sm font-semibold text-[#222] transition hover:border-theme hover:text-theme"
        >
          Buscar productos
        </Link>
      </div>
    </div>
  );
}
