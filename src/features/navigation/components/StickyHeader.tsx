"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu } from "lucide-react";

import { CartOffcanvas } from "@/features/cart/components/CartOffcanvas";
import { CartTrigger } from "@/features/cart/components/CartTrigger";
import { HeaderLogo } from "@/features/navigation/components/HeaderLogo";
import { HeaderSearch } from "@/features/navigation/components/HeaderSearch";
import { HeaderTopBar } from "@/features/navigation/components/HeaderTopBar";
import { HeaderUserMenu } from "@/features/navigation/components/HeaderUserMenu";
import { MainNavigation } from "@/features/navigation/components/MainNavigation";
import { MobileBottomNav } from "@/features/navigation/components/MobileBottomNav";
import type { HeaderLogoProps, TopBarConfig } from "@/features/navigation/types/navigation.types";
import { cn } from "@/lib/utils";

interface StickyHeaderProps extends HeaderLogoProps, TopBarConfig {
  sticky?: boolean;
}

export function StickyHeader({
  logoUrl,
  brandName,
  enabled: topBarEnabled = true,
  siteName,
  supportNumber,
  sticky = true,
}: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setIsSticky(window.scrollY >= 50 && window.innerWidth > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sticky]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMenuOpen]);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const showTopBar = topBarEnabled && !isSticky;

  const iconNavItemClass = cn(
    "onhover-div relative flex items-center justify-center",
    "py-[clamp(15px,2vw,30px)] pl-[clamp(8px,1.2vw,20px)]",
  );

  return (
    <>
      <header
        className={cn(
          "relative z-50 w-full bg-white transition-all duration-300",
          isSticky && sticky && "fixed left-0 top-0 shadow-[0_0_5px_rgba(0,0,0,0.12)]",
        )}
      >
        {showTopBar ? (
          <HeaderTopBar siteName={siteName} supportNumber={supportNumber} />
        ) : null}

        <div className="metro">
          <div className="mx-auto w-full max-w-[1400px] px-4">
            <div className="flex items-center justify-between">
              <div className="menu-left flex items-center">
                <button
                  type="button"
                  onClick={openMenu}
                  className={cn(
                    "toggle-nav mr-[22px] cursor-pointer py-[clamp(18px,3vw,40px)] xl:hidden",
                    "text-theme",
                  )}
                  aria-label="Abrir menú"
                  aria-expanded={isMenuOpen}
                >
                  <Menu className="size-6 stroke-[2]" />
                </button>

                <div className="brand-logo">
                  <HeaderLogo logoUrl={logoUrl} brandName={brandName} />
                </div>
              </div>

              <div className="menu-right flex items-center">
                <MainNavigation isOpen={isMenuOpen} onClose={closeMenu} />

                <div className="icon-nav inline-flex items-center">
                  <ul className="flex items-center">
                    <li
                      className={cn(
                        iconNavItemClass,
                        "max-[578px]:first:hidden max-[578px]:nth-2:hidden",
                      )}
                    >
                      <HeaderSearch />
                    </li>

                    <li className={cn(iconNavItemClass, "hidden min-[579px]:flex")}>
                      <Link
                        href="/micuenta/favoritos"
                        className="inline-flex items-center text-[#6a6a6a] transition-colors hover:text-theme"
                        aria-label="Lista de favoritos"
                      >
                        <Heart className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
                      </Link>
                    </li>

                    <li className={iconNavItemClass}>
                      <CartTrigger />
                    </li>

                    <li className={cn(iconNavItemClass, "onhover-dropdown mobile-cart")}>
                      <HeaderUserMenu />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isSticky && sticky ? (
        <div className="h-[72px] md:h-[88px]" aria-hidden />
      ) : null}

      <CartOffcanvas />
      <MobileBottomNav />
      <div className="h-[72px] md:hidden" aria-hidden />
    </>
  );
}
