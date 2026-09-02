import {
  FALLBACK_HOME_HERO_SLIDES,
  HERO_REVALIDATE_SECONDS,
} from "@/features/home/constants/home-hero.defaults";
import type { HomeHeroSlide, PublicHeroSlidesResponse } from "@/features/home/types/hero.types";
import { apiGet } from "@/services/http-client";

export async function getHomeHeroSlides(): Promise<HomeHeroSlide[]> {
  try {
    const response = await apiGet<PublicHeroSlidesResponse>("ecommerce/hero-slides", {
      revalidate: HERO_REVALIDATE_SECONDS,
    });

    return response.slides
      .filter((slide) => slide.imageUrl)
      .sort((a, b) => a.order - b.order);
  } catch {
    return FALLBACK_HOME_HERO_SLIDES;
  }
}
