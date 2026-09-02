"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

const PLACEHOLDER_TEXT = "Buscar por marca y categoría...";

export function HeaderSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let index = 0;
    const interval = window.setInterval(() => {
      index = (index + 1) % (PLACEHOLDER_TEXT.length + 1);
      setTypedText(PLACEHOLDER_TEXT.slice(0, index));
    }, 80);

    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      closeSearch();
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    },
    [closeSearch, query, router],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex cursor-pointer items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
        aria-label="Abrir búsqueda"
      >
        <Search className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      </button>

      <div
        className={cn(
          "fixed left-1/2 z-50 w-full max-w-[1400px] -translate-x-1/2 px-4",
          "top-[clamp(84px,8vw,103px)]",
          "transition-all duration-300",
          isOpen
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-0 opacity-0",
        )}
        role="search"
        aria-hidden={!isOpen}
      >
        <form onSubmit={handleSubmit} className="relative overflow-hidden border border-[#eee] bg-white">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#777]">
            <Search className="size-5 stroke-[1.5]" />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${typedText}|`}
            className={cn(
              "w-full border-0 bg-transparent py-[clamp(10px,1.2vw,13px)]",
              "pl-11 pr-11 text-[#222] outline-none",
            )}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-[#777] hover:text-[#222]"
            aria-label="Cerrar búsqueda"
          >
            <X className="size-5" />
          </button>
        </form>
      </div>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeSearch}
          aria-label="Cerrar búsqueda"
        />
      ) : null}
    </>
  );
}
