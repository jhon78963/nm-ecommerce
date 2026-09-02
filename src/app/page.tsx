import { HomeBannerSection } from "@/features/home/components/banners/HomeBannerSection";
import { ProductCollectionSection } from "@/features/home/components/collections/ProductCollectionSection";
import { HomeHeroSection } from "@/features/home/components/hero/HomeHeroSection";
import { getHomeBanners } from "@/features/home/services/banner.service";
import { getHomeHeroSlides } from "@/features/home/services/hero.service";

export default async function Home() {
  const [slides, banners] = await Promise.all([getHomeHeroSlides(), getHomeBanners()]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <HomeHeroSection slides={slides} />
      <HomeBannerSection banners={banners} />
      <ProductCollectionSection />
    </div>
  );
}
