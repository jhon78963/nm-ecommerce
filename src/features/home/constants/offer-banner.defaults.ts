import type { HomeOfferBanner } from "@/features/home/types/offer-banner.types";
import { ROUTES } from "@/lib/routes";

/** marketplace_one.json → content.offer_banner_2 */
export const FALLBACK_HOME_OFFER_BANNER: HomeOfferBanner = {
  id: "default-offer-banner",
  status: true,
  imageUrl: "/images/theme/marketplace_one/marketplace_one_6.png",
  href: ROUTES.shop,
  alt: "Banner promocional del home",
};

export const OFFER_BANNER_REVALIDATE_SECONDS = 300;
