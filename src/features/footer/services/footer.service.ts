import {
  FALLBACK_FOOTER_CONFIG,
  FOOTER_REVALIDATE_SECONDS,
} from "@/features/footer/constants/footer.defaults";
import type { PublicFooterResponse, StoreFooterConfig } from "@/features/footer/types/footer.types";
import { apiGet } from "@/services/http-client";

export async function getStoreFooterConfig(): Promise<StoreFooterConfig> {
  try {
    const response = await apiGet<PublicFooterResponse>("ecommerce/footer", {
      revalidate: FOOTER_REVALIDATE_SECONDS,
    });

    if (!response.footer) {
      return FALLBACK_FOOTER_CONFIG;
    }

    return response.footer;
  } catch {
    return FALLBACK_FOOTER_CONFIG;
  }
}
