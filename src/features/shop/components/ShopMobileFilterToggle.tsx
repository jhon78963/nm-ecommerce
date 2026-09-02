"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ShopSidebar } from "./sidebar/ShopSidebar";
import type { ShopCollection, ShopProductsFacets } from "../types/shop.types";

interface ShopMobileFilterToggleProps {
  collections: ShopCollection[];
  activeCollection?: ShopCollection;
  facets: ShopProductsFacets;
}

export function ShopMobileFilterToggle({
  collections,
  activeCollection,
  facets,
}: ShopMobileFilterToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded border border-[#e5e5e5] px-4 py-2 text-[13px] font-medium text-[#555] transition-colors hover:border-theme hover:text-theme"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>

      {isOpen ? (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] px-5 py-4">
              <h3 className="text-[14px] font-semibold uppercase tracking-wider text-[#222]">
                Filtros
              </h3>
              <button
                type="button"
                aria-label="Cerrar filtros"
                onClick={() => setIsOpen(false)}
                className="text-[#999] transition-colors hover:text-theme"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
              <ShopSidebar
                collections={collections}
                activeCollection={activeCollection}
                facets={facets}
              />
            </div>

            <div className="border-t border-[#f1f1f1] p-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full rounded bg-theme py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
