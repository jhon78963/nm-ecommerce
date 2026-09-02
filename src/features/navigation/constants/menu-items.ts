import type { NavMenuItem } from "@/features/navigation/types/navigation.types";
import { FALLBACK_SHOP_COLLECTIONS } from "@/features/shop/constants/shop.constants";
import { ROUTES } from "@/lib/routes";

export const MAIN_NAV_ITEMS: NavMenuItem[] = FALLBACK_SHOP_COLLECTIONS.map((collection) => ({
  id: collection.slug,
  title: collection.label,
  href: ROUTES.collection(collection.slug),
}));
