import { StickyHeader } from "@/features/navigation/components/StickyHeader";
import type { HeaderLogoProps, TopBarConfig } from "@/features/navigation/types/navigation.types";

export interface HeaderProps extends HeaderLogoProps, TopBarConfig {
  isAuthenticated?: boolean;
  sticky?: boolean;
}

export function Header({
  logoUrl,
  brandName,
  initials,
  enabled: topBarEnabled = true,
  siteName,
  supportNumber,
  isAuthenticated = false,
  sticky = true,
}: HeaderProps) {
  return (
    <StickyHeader
      logoUrl={logoUrl}
      brandName={brandName}
      initials={initials}
      enabled={topBarEnabled}
      siteName={siteName}
      supportNumber={supportNumber}
      isAuthenticated={isAuthenticated}
      sticky={sticky}
    />
  );
}
