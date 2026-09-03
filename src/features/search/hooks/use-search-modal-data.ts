"use client";

import { useEffect, useState } from "react";

import type { SearchModalResult } from "@/features/search/types/search.types";

const EMPTY_RESULT: SearchModalResult = {
  products: [],
  collections: [],
  genders: [],
  query: "",
};

export function useSearchModalData(query: string, enabled: boolean) {
  const [data, setData] = useState<SearchModalResult>(EMPTY_RESULT);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({ perPage: "4" });
        if (query.trim()) params.set("q", query.trim());

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setData({ ...EMPTY_RESULT, query });
          return;
        }

        const result = (await response.json()) as SearchModalResult;
        setData(result);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setData({ ...EMPTY_RESULT, query });
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [enabled, query]);

  return { data, isLoading };
}
