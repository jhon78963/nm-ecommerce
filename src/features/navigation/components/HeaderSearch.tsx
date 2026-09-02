"use client";

import { useCallback, useState } from "react";
import { Search } from "lucide-react";

import { SearchModal } from "@/features/search/components/SearchModal";

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex cursor-pointer items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
        aria-label="Abrir búsqueda"
      >
        <Search className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      </button>

      <SearchModal isOpen={isOpen} onClose={closeSearch} />
    </>
  );
}
