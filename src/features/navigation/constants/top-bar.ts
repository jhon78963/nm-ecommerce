import type { CurrencyOption, LanguageOption } from "@/features/navigation/types/navigation.types";

export const DEFAULT_TOP_BAR = {
  siteName: "Novedades Maritex",
  supportNumber: "+51 999 999 999",
} as const;

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "es", label: "Español", flag: "🇵🇪" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "PEN", symbol: "S/" },
  { code: "USD", symbol: "$" },
];
