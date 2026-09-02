"use client";

import { useEffect, useState } from "react";

const DEFAULT_TEXT = "Buscar por marcas y categorías...";

export function useTypewriterPlaceholder(active: boolean) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!active) {
      setTypedText("");
      return;
    }

    let index = 0;
    let erase = false;

    const interval = window.setInterval(() => {
      if (!erase) {
        index += 1;
        setTypedText(DEFAULT_TEXT.slice(0, index));
        if (index >= DEFAULT_TEXT.length) erase = true;
      } else {
        index -= 1;
        setTypedText(DEFAULT_TEXT.slice(0, index));
        if (index <= 0) erase = false;
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, [active]);

  return typedText;
}
