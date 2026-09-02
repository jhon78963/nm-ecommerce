import { ImageLink } from "@/features/home/components/banners/ImageLink";
import type { HomeBanner } from "@/features/home/types/banner.types";

interface BannerImageLinkProps {
  banner: HomeBanner;
}

export function BannerImageLink({ banner }: BannerImageLinkProps) {
  return (
    <ImageLink
      href={banner.href}
      imageUrl={banner.imageUrl}
      alt="Banner promocional"
      bgImage
    />
  );
}
