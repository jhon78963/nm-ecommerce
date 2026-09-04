"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { ProductBox } from "@/features/product/components/ProductBox";
import { SearchCategoryLinks } from "@/features/search/components/SearchCategoryLinks";
import type { SearchModalResult } from "@/features/search/types/search.types";
import { ROUTES } from "@/lib/routes";

interface SearchLandingProps {
  data: SearchModalResult;
}

export function SearchLanding({ data }: SearchLandingProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    router.push(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-5 text-[22px] font-semibold text-[#222]">Buscar en la tienda</h1>

        <form onSubmit={handleSubmit} className="relative mb-4 max-w-2xl">
          <label htmlFor="store-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="store-search"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="¿Qué estás buscando?"
            className="w-full border border-[#eee] bg-white py-3 pl-4 pr-14 text-base text-[#222] outline-none focus:border-theme"
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-0 top-0 flex h-full cursor-pointer items-center px-4 text-[#777] hover:text-theme"
            aria-label="Buscar"
          >
            <Search className="size-5 border-l border-[#eee] pl-3" />
          </button>
        </form>

        <SearchCategoryLinks collections={data.collections} />

        {data.products.length > 0 ? (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-[#373737]">Más buscados</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {data.products.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductBox product={product} fullHeight />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
