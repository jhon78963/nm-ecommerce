import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type {
  HomeOfferBanner,
  PublicOfferBannerResponse,
} from "@/features/home/types/offer-banner.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeOfferBanner(): Promise<HomeOfferBanner | null> {
  try {
    const response = await apiGet<PublicOfferBannerResponse>("ecommerce/banners/offer", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.banner || response.banner.status === false) {
      return null;
    }

    return {
      ...response.banner,
      imageUrl: resolveStoreMediaUrl(response.banner.imageUrl),
    };
  } catch {
    return null;
  }
}
