import { WishlistTable } from "@/features/wishlist/components/WishlistTable";

export function WishlistPage() {
  return (
    <section className="wishlist-section section-b-space pt-0">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#222] md:text-3xl">Mis Favoritos</h1>
          <p className="mt-2 text-sm text-[#777]">
            Tus productos guardados están disponibles en este dispositivo sin necesidad de iniciar sesión.
          </p>
        </div>

        <WishlistTable />
      </div>
    </section>
  );
}
