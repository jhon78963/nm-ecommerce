import type { NavMenuItem } from "@/features/navigation/types/navigation.types";

export interface PublicNavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  parentId: string | null;
}

export interface PublicHeaderResponse {
  id: string | null;
  topbarMessage: string | null;
  supportPhone: string | null;
  logoText: string;
  logoUrl: string | null;
  topBarEnabled: boolean;
  stickyEnabled: boolean;
  navigationItems: PublicNavigationItem[];
}

export interface StoreHeaderConfig {
  logoUrl: string | null;
  brandName: string;
  topBarEnabled: boolean;
  sticky: boolean;
  siteName: string;
  supportNumber: string | null;
  navItems: NavMenuItem[];
}
