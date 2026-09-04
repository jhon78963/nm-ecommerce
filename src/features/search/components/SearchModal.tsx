"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { SearchCategoryLinks } from "@/features/search/components/SearchCategoryLinks";
import { SearchEmptyState } from "@/features/search/components/SearchEmptyState";
import {
  SearchCategorySkeleton,
  SearchProductSkeleton,
} from "@/features/search/components/SearchSkeleton";
import { ProductBox } from "@/features/product/components/ProductBox";
import { useSearchModalData } from "@/features/search/hooks/use-search-modal-data";
import { useTypewriterPlaceholder } from "@/features/search/hooks/use-typewriter-placeholder";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const typedText = useTypewriterPlaceholder(isOpen);
  const { data, isLoading } = useSearchModalData(query, isOpen);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      onClose();
      router.push(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
    },
    [onClose, query, router],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <button
        type="button"
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Cerrar búsqueda"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
        className="search-modal relative z-[71] my-4 w-full max-w-6xl bg-white shadow-xl"
      >
        <div className="modal-header flex items-center justify-between border-b border-[#eee] px-5 py-4">
          <h3 id="search-modal-title" className="text-lg font-semibold text-[#222] sm:text-xl">
            Buscar en la tienda
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center text-[#333] hover:text-theme"
            aria-label="Cerrar"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="modal-body p-5">
          <form onSubmit={handleSubmit}>
            <div className="search-box relative">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`${typedText}|`}
                className={cn(
                  "w-full border border-[#eee] bg-white py-3 pl-4 pr-14",
                  "text-base text-[#222] outline-none focus:border-theme",
                )}
                autoComplete="off"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 border-l border-[#eee] pl-3 text-[#777]" />
            </div>
          </form>

          <div className="search-category-box mt-2.5">
            {isLoading ? (
              <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
                <li className="font-medium text-[#6a6a6a]">Búsquedas top:</li>
                <SearchCategorySkeleton />
              </ul>
            ) : (
              <SearchCategoryLinks collections={data.collections} onNavigate={onClose} />
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <h3 className="search-title mb-2 text-lg font-medium text-[#373737] sm:mb-3 sm:text-xl">
              Más buscados
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {isLoading ? (
                <SearchProductSkeleton count={4} />
              ) : data.products.length > 0 ? (
                data.products.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-0"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a,button")) {
                        onClose();
                      }
                    }}
                    onKeyDown={undefined}
                    role="presentation"
                  >
                    <ProductBox product={product} fullHeight />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <SearchEmptyState />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
