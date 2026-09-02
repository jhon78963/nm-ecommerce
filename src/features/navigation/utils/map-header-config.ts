import type {
  PublicHeaderResponse,
  PublicNavigationItem,
  StoreHeaderConfig,
} from "@/features/navigation/types/header.types";
import type { NavMenuItem } from "@/features/navigation/types/navigation.types";

function mapNavigationItem(item: PublicNavigationItem): NavMenuItem {
  return {
    id: item.id,
    title: item.label,
    href: item.href,
  };
}

export function mapPublicHeaderToConfig(response: PublicHeaderResponse): StoreHeaderConfig {
  const rootItems = response.navigationItems
    .filter((item) => !item.parentId)
    .sort((a, b) => a.order - b.order);

  const childrenByParent = response.navigationItems.reduce<Record<string, PublicNavigationItem[]>>(
    (acc, item) => {
      if (!item.parentId) return acc;
      acc[item.parentId] = [...(acc[item.parentId] ?? []), item];
      return acc;
    },
    {},
  );

  const navItems: NavMenuItem[] = rootItems.map((item) => {
    const children = (childrenByParent[item.id] ?? [])
      .sort((a, b) => a.order - b.order)
      .map(mapNavigationItem);

    return {
      ...mapNavigationItem(item),
      ...(children.length > 0 ? { children } : {}),
    };
  });

  return {
    logoUrl: response.logoUrl,
    brandName: response.logoText,
    topBarEnabled: response.topBarEnabled,
    sticky: response.stickyEnabled,
    siteName: response.topbarMessage ?? response.logoText,
    supportNumber: response.supportPhone,
    navItems,
  };
}
