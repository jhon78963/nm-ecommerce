import Link from "next/link";
import { Heart } from "lucide-react";

export function WishlistEmptyState() {
  return (
    <div className="no-data-added flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-[#f8f8f8] text-theme">
        <Heart className="size-9 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-[#222]">No hay artículos en favoritos</h3>
      <p className="mt-2 max-w-md text-sm text-[#777]">
        Guarda los productos que te gusten para verlos más tarde. No necesitas iniciar sesión.
      </p>
      <Link
        href="/tienda"
        className="mt-6 inline-flex border border-theme bg-theme px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-theme"
      >
        Explorar tienda
      </Link>
    </div>
  );
}
