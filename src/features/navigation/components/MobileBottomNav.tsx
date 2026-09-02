"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof Home;
  isCart?: boolean;
}

const NAV_ITEMS: MobileNavItem[] = [
  { id: "home", label: "Inicio", href: "/", icon: Home },
  { id: "search", label: "Buscar", href: "/buscar", icon: Search },
  { id: "cart", label: "Carrito", href: "/carrito", icon: ShoppingBag, isCart: true },
  { id: "wishlist", label: "Favoritos", href: "/micuenta/favoritos", icon: Heart },
  { id: "user", label: "Cuenta", href: "/micuenta/miperfil", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 z-30 w-full bg-white px-2.5 py-2.5 shadow-[0_-3px_10px_rgba(0,0,0,0.08)] md:hidden"
      aria-label="Navegación móvil"
    >
      <ul className="mx-auto flex w-full">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.id === "home"
              ? pathname === "/"
              : item.id === "search"
                ? pathname.startsWith("/buscar")
                : pathname.startsWith(item.href);

          const Icon = item.icon;

          if (item.isCart) {
            return (
              <li key={item.id} className="relative w-full text-center">
                <button
                  type="button"
                  onClick={openCart}
                  className="relative inline-flex w-full flex-col items-center gap-0.5 text-[#6a6a6a]"
                >
                  <Icon className="mx-auto size-5" />
                  <span className="text-xs">Carrito</span>
                  {itemCount > 0 ? (
                    <span className="absolute right-[calc(50%-18px)] top-0 flex size-4 items-center justify-center rounded-full bg-theme text-[10px] font-semibold text-white">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          }

          return (
            <li key={item.id} className="relative w-full text-center">
              <Link
                href={item.href}
                className={cn(
                  "relative inline-flex w-full flex-col items-center gap-0.5 text-[#6a6a6a]",
                  isActive && "font-semibold text-[#222]",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute -bottom-3.5 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-full bg-theme"
                    aria-hidden
                  />
                ) : null}
                <Icon className="mx-auto size-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
