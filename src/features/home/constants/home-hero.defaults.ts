export interface HomeHeroSlide {
  id: string;
  imageUrl: string;
  href: string;
  alt: string;
}

export const DEFAULT_HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: "hero-1",
    imageUrl: "/images/home/home-hero-1.png",
    href: "/tienda",
    alt: "Banner principal",
  },
];
