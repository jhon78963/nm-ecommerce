export interface NavMenuItem {
  id: string;
  title: string;
  href: string;
  children?: NavMenuItem[];
}

export interface HeaderLogoProps {
  logoUrl?: string | null;
  brandName?: string;
}

export interface TopBarConfig {
  enabled?: boolean;
  siteName?: string;
  supportNumber?: string | null;
}

export interface HeaderNavigationConfig {
  navItems: NavMenuItem[];
  sticky?: boolean;
}

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
}
