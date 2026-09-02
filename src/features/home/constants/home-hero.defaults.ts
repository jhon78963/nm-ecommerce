import type { HomeHeroSlide } from "@/features/home/types/hero.types";

export const FALLBACK_HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: "hero-1",
    imageUrl: "/images/home/home-hero-1.png",
    href: "/tienda",
    alt: "Banner principal",
    order: 0,
  },
];

export const HERO_REVALIDATE_SECONDS = 300;
