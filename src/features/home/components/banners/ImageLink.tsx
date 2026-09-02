import Link from "next/link";

import { cn } from "@/lib/utils";

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
  const imageContent = bgImage ? (
    <div
      className={cn(
        "banner-bg-size block w-full bg-cover bg-center bg-no-repeat",
        imageClassName,
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
      role="img"
      aria-label={alt}
    />
  ) : (
    <img
      src={imageUrl}
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
