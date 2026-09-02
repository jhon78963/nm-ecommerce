import { BannerImageLink } from "@/features/home/components/BannerImageLink";
import type { HomeBanner } from "@/features/home/types/banner.types";
import { getBannerGridClass } from "@/features/home/utils/banner-grid";

interface HomeBannerSectionProps {
  banners: HomeBanner[];
}

export function HomeBannerSection({ banners }: HomeBannerSectionProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="banner-section banner-padding ratio2_1">
      <div className="w-full px-4">
        <div className={getBannerGridClass(banners.length) + " grid gap-3 sm:gap-4"}>
          {banners.map((banner) => (
            <div key={banner.id} className="relative">
              <BannerImageLink banner={banner} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
