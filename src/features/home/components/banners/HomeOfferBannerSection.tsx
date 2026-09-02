import { ImageLink } from "@/features/home/components/banners/ImageLink";
import type { HomeOfferBanner } from "@/features/home/types/offer-banner.types";

interface HomeOfferBannerSectionProps {
  banner: HomeOfferBanner | null;
}

export function HomeOfferBannerSection({ banner }: HomeOfferBannerSectionProps) {
  if (!banner || banner.status === false) {
    return null;
  }

  return (
    <section className="p-0">
      <ImageLink
        href={banner.href}
        imageUrl={banner.imageUrl}
        alt={banner.alt ?? "Banner promocional"}
        bgImage={false}
      />
    </section>
  );
}
