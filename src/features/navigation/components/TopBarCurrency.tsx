"use client";

import { useEffect, useState } from "react";

import { TopBarDropdown } from "@/features/navigation/components/TopBarDropdown";
import { CURRENCY_OPTIONS } from "@/features/navigation/constants/top-bar";
import type { CurrencyOption } from "@/features/navigation/types/navigation.types";

const STORAGE_KEY = "nm-currency";

export function TopBarCurrency() {
  const [selected, setSelected] = useState<CurrencyOption>(CURRENCY_OPTIONS[0]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as CurrencyOption;
      const match = CURRENCY_OPTIONS.find((currency) => currency.code === parsed.code);
      if (match) setSelected(match);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleChange = (code: string) => {
    const currency = CURRENCY_OPTIONS.find((item) => item.code === code);
    if (!currency) return;

    setSelected(currency);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currency));
  };

  return (
    <TopBarDropdown
      value={selected.code}
      options={CURRENCY_OPTIONS.map((currency) => ({
        value: currency.code,
        label: currency.code,
      }))}
      onChange={handleChange}
      className="pl-3 ml-3 border-l border-[#77777785]"
    />
  );
}
