export interface HomeHeroSlide {
  id: string;
  imageUrl: string;
  href: string;
  alt: string;
  order: number;
}

export interface PublicHeroSlidesResponse {
  slides: HomeHeroSlide[];
}
