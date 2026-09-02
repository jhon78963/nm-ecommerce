import {
  FALLBACK_HOME_OFFER_BANNER,
  OFFER_BANNER_REVALIDATE_SECONDS,
} from "@/features/home/constants/offer-banner.defaults";
import type {
  HomeOfferBanner,
  PublicOfferBannerResponse,
} from "@/features/home/types/offer-banner.types";
import { apiGet } from "@/services/http-client";

export async function getHomeOfferBanner(): Promise<HomeOfferBanner | null> {
  try {
    const response = await apiGet<PublicOfferBannerResponse>("ecommerce/banners/offer", {
      revalidate: OFFER_BANNER_REVALIDATE_SECONDS,
    });

    if (!response.banner || response.banner.status === false) {
      return null;
    }

    return response.banner;
  } catch {
    return FALLBACK_HOME_OFFER_BANNER;
  }
}
