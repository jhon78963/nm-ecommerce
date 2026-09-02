import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type { HomeHeroSlide, PublicHeroSlidesResponse } from "@/features/home/types/hero.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeHeroSlides(): Promise<HomeHeroSlide[]> {
  try {
    const response = await apiGet<PublicHeroSlidesResponse>("ecommerce/hero-slides", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    return response.slides
      .filter((slide) => slide.imageUrl)
      .map((slide) => ({
        ...slide,
        imageUrl: resolveStoreMediaUrl(slide.imageUrl),
      }))
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}
