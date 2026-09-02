import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type { PublicFooterResponse, StoreFooterConfig } from "@/features/footer/types/footer.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

const EMPTY_FOOTER_CONFIG: StoreFooterConfig = {
  newsletterTitle: "",
  newsletterSubtitle: "",
  aboutText: "",
  address: "",
  supportNumber: "",
  supportEmail: "",
  socialMediaEnabled: false,
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  pinterestUrl: "",
  categories: [],
  usefulLinks: [],
  helpCenterLinks: [],
  copyrightEnabled: false,
  copyrightContent: "",
  paymentImageUrl: "",
};

export async function getStoreFooterConfig(): Promise<StoreFooterConfig> {
  try {
    const response = await apiGet<PublicFooterResponse>("ecommerce/footer", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.footer) {
      return EMPTY_FOOTER_CONFIG;
    }

    return {
      ...response.footer,
      paymentImageUrl: resolveStoreMediaUrl(response.footer.paymentImageUrl),
    };
  } catch {
    return EMPTY_FOOTER_CONFIG;
  }
}
