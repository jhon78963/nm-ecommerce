export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-theme">Novedades Maritex</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold text-[#222] md:text-5xl">
          Moda para toda la familia
        </h1>
        <p className="mt-4 max-w-xl text-base text-[#777] md:text-lg">
          Descubre las mejores tendencias y precios en nuestro catálogo en línea.
        </p>
      </section>
    </div>
  );
}
