import { StickyHeader } from "@/features/navigation/components/StickyHeader";
import type { HeaderLogoProps, TopBarConfig } from "@/features/navigation/types/navigation.types";

export interface HeaderProps extends HeaderLogoProps, TopBarConfig {
  sticky?: boolean;
}

export function Header({
  logoUrl,
  brandName,
  enabled: topBarEnabled = true,
  siteName,
  supportNumber,
  sticky = true,
}: HeaderProps) {
  return (
    <StickyHeader
      logoUrl={logoUrl}
      brandName={brandName}
      enabled={topBarEnabled}
      siteName={siteName}
      supportNumber={supportNumber}
      sticky={sticky}
    />
  );
}
