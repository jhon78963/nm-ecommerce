import Link from "next/link";

import { cn } from "@/lib/utils";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

interface ImageLinkProps {
  href: string;
  imageUrl: string;
  alt?: string;
  bgImage?: boolean;
  className?: string;
  imageClassName?: string;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function ImageLink({
  href,
  imageUrl,
  alt = "Banner promocional",
  bgImage = false,
  className,
  imageClassName,
}: ImageLinkProps) {
  const resolvedImageUrl = resolveStoreMediaUrl(imageUrl);

  const imageContent = bgImage ? (
    <div
      className={cn(
        "banner-bg-size block w-full bg-cover bg-center bg-no-repeat",
        imageClassName,
      )}
      style={{ backgroundImage: `url(${resolvedImageUrl})` }}
      role="img"
      aria-label={alt}
    />
  ) : (
    <img
      src={resolvedImageUrl}
      alt={alt}
      className={cn("block h-auto w-full", imageClassName)}
    />
  );

  const wrapperClass = cn("banner-contain block overflow-hidden", className);

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
        {imageContent}
      </a>
    );
  }

  return (
    <Link href={href} className={wrapperClass}>
      {imageContent}
    </Link>
  );
}
