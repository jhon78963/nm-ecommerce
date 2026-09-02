import { StickyHeader } from "@/features/navigation/components/StickyHeader";
import { getStoreHeaderConfig } from "@/features/navigation/services/header.service";

export async function Header() {
  const config = await getStoreHeaderConfig();

  return (
    <StickyHeader
      logoUrl={config.logoUrl}
      brandName={config.brandName}
      enabled={config.topBarEnabled}
      siteName={config.siteName}
      supportNumber={config.supportNumber}
      sticky={config.sticky}
      navItems={config.navItems}
    />
  );
}
