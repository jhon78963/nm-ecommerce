"use client";

import { useEffect, useRef } from "react";

import { getDefaultDocumentTitle, SITE_META } from "@/features/seo/constants/site-meta";

export function useExitTagline() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const messageIndexRef = useRef(0);

  useEffect(() => {
    if (!SITE_META.exitTaglineEnabled) return;

    const defaultTitle = getDefaultDocumentTitle();

    const updateMessage = () => {
      clearTimeout(timeoutRef.current);

      const { taglines, messageDelayMs } = SITE_META;
      document.title = taglines[messageIndexRef.current] ?? taglines[0];
      messageIndexRef.current = (messageIndexRef.current + 1) % taglines.length;

      timeoutRef.current = setTimeout(updateMessage, messageDelayMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateMessage();
        return;
      }

      clearTimeout(timeoutRef.current);
      document.title = defaultTitle;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timeoutRef.current);
      document.title = defaultTitle;
    };
  }, []);
}
