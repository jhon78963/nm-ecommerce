import { WishlistTable } from "@/features/wishlist/components/WishlistTable";

interface WishlistPageProps {
  /** Dentro del shell de Mi cuenta (sin título duplicado). */
  embedded?: boolean;
}

export function WishlistPage({ embedded = false }: WishlistPageProps) {
  const content = (
    <>
      {!embedded ? (
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-xl font-bold text-[#222] md:text-3xl">Mis Favoritos</h1>
          <p className="mt-2 text-sm text-[#777]">
            Tus productos guardados están disponibles en este dispositivo.
          </p>
        </div>
      ) : (
        <p className="mb-5 text-sm text-[#777]">
          Tus productos guardados en este dispositivo. Puedes agregarlos al carrito cuando quieras.
        </p>
      )}
      <WishlistTable embedded={embedded} />
    </>
  );

  if (embedded) {
    return <div className="account-card"><div className="account-card__body">{content}</div></div>;
  }

  return (
    <section className="wishlist-section pt-0 pb-[70px]">
      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8 md:py-12">
        {content}
      </div>
    </section>
  );
}
