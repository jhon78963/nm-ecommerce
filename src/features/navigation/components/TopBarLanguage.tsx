"use client";

import { useEffect, useState } from "react";

import { TopBarDropdown } from "@/features/navigation/components/TopBarDropdown";
import { LANGUAGE_OPTIONS } from "@/features/navigation/constants/top-bar";
import type { LanguageOption } from "@/features/navigation/types/navigation.types";

const STORAGE_KEY = "nm-language";

export function TopBarLanguage() {
  const [selected, setSelected] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as LanguageOption;
      const match = LANGUAGE_OPTIONS.find((lang) => lang.code === parsed.code);
      if (match) setSelected(match);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleChange = (code: string) => {
    const language = LANGUAGE_OPTIONS.find((lang) => lang.code === code);
    if (!language) return;

    setSelected(language);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(language));
    document.documentElement.lang = language.code;
  };

  return (
    <TopBarDropdown
      value={selected.code}
      options={LANGUAGE_OPTIONS.map((lang) => ({
        value: lang.code,
        label: lang.label,
        prefix: lang.flag,
      }))}
      onChange={handleChange}
    />
  );
}
