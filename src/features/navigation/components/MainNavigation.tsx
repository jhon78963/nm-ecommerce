"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import { MAIN_NAV_ITEMS } from "@/features/navigation/constants/menu-items";
import type { NavMenuItem } from "@/features/navigation/types/navigation.types";
import { cn } from "@/lib/utils";

interface MainNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavLink({ item, onNavigate }: { item: NavMenuItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "relative block whitespace-nowrap px-0 py-[15px] text-[17px] font-medium leading-tight text-[#222]",
        "xl:pr-6 xl:py-[15px]",
        isActive && "text-theme",
      )}
    >
      {item.title}
    </Link>
  );
}

export function MainNavigation({ isOpen, onClose }: MainNavigationProps) {
  return (
    <>
      <nav className="hidden xl:block" aria-label="Navegación principal">
        <ul className="flex items-center">
          {MAIN_NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative">
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(320px,85vw)] flex-col bg-white shadow-xl",
          "transition-transform duration-300 xl:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-[#eee] px-4 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#222]">Menú</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#6a6a6a] hover:text-[#222]"
            aria-label="Cerrar menú"
          >
            <X className="size-6" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-4 py-2">
          {MAIN_NAV_ITEMS.map((item) => (
            <li key={item.id} className="border-b border-[#eee] last:border-0">
              <div className="flex items-center justify-between">
                <NavLink item={item} onNavigate={onClose} />
                {item.children?.length ? (
                  <ChevronDown className="size-4 text-[#6a6a6a]" />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
