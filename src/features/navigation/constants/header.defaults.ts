import { DEFAULT_BRAND_LOGO_URL, DEFAULT_BRAND_NAME } from "@/features/navigation/constants/branding";
import { MAIN_NAV_ITEMS } from "@/features/navigation/constants/menu-items";
import { DEFAULT_TOP_BAR } from "@/features/navigation/constants/top-bar";
import type { StoreHeaderConfig } from "@/features/navigation/types/header.types";

export const FALLBACK_HEADER_CONFIG: StoreHeaderConfig = {
  logoUrl: DEFAULT_BRAND_LOGO_URL,
  brandName: DEFAULT_BRAND_NAME,
  topBarEnabled: true,
  sticky: true,
  siteName: DEFAULT_TOP_BAR.siteName,
  supportNumber: DEFAULT_TOP_BAR.supportNumber,
  navItems: MAIN_NAV_ITEMS,
};

export const HEADER_REVALIDATE_SECONDS = 300;
