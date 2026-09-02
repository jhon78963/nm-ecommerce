import { HomeBannerSection } from "@/features/home/components/banners/HomeBannerSection";
import { HomeOfferBannerSection } from "@/features/home/components/banners/HomeOfferBannerSection";
import { ProductCollectionSection } from "@/features/home/components/collections/ProductCollectionSection";
import { HomeHeroSection } from "@/features/home/components/hero/HomeHeroSection";
import { getHomeBanners } from "@/features/home/services/banner.service";
import { getHomeHeroSlides } from "@/features/home/services/hero.service";
import { getHomeOfferBanner } from "@/features/home/services/offer-banner.service";

export default async function Home() {
  const [slides, banners, offerBanner] = await Promise.all([
    getHomeHeroSlides(),
    getHomeBanners(),
    getHomeOfferBanner(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <HomeHeroSection slides={slides} />
      <HomeBannerSection banners={banners} />
      <ProductCollectionSection />
      <HomeOfferBannerSection banner={offerBanner} />
    </div>
  );
}
