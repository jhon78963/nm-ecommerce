import { HomeBannerSection } from "@/features/home/components/HomeBannerSection";
import { HomeHeroSection } from "@/features/home/components/HomeHeroSection";
import { getHomeBanners } from "@/features/home/services/banner.service";

export default async function Home() {
  const banners = await getHomeBanners();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <HomeHeroSection />
      <HomeBannerSection banners={banners} />
    </div>
  );
}
