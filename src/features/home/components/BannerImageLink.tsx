import Link from "next/link";

import type { HomeBanner } from "@/features/home/types/banner.types";

interface BannerImageLinkProps {
  banner: HomeBanner;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function BannerImageLink({ banner }: BannerImageLinkProps) {
  const content = (
    <div
      className="banner-bg-size block w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${banner.imageUrl})` }}
      role="img"
      aria-label="Banner promocional"
    />
  );

  if (isExternalHref(banner.href)) {
    return (
      <a
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="banner-contain block overflow-hidden"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={banner.href} className="banner-contain block overflow-hidden">
      {content}
    </Link>
  );
}
