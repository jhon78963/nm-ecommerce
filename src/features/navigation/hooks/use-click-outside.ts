"use client";

import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  enabled = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [enabled, onOutside]);

  return ref;
}
