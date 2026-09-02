import { HomeBannerSection } from "@/features/home/components/banners/HomeBannerSection";
import { HomeOfferBannerSection } from "@/features/home/components/banners/HomeOfferBannerSection";
import { HomeCategoryProductSection } from "@/features/home/components/category-products/HomeCategoryProductSection";
import { ProductCollectionSection } from "@/features/home/components/collections/ProductCollectionSection";
import { HomeHeroSection } from "@/features/home/components/hero/HomeHeroSection";
import { HomeServicesSection } from "@/features/home/components/services/HomeServicesSection";
import { getHomeBanners } from "@/features/home/services/banner.service";
import { getHomeCategoryProductSection } from "@/features/home/services/category-product.service";
import { getHomeHeroSlides } from "@/features/home/services/hero.service";
import { getHomeOfferBanner } from "@/features/home/services/offer-banner.service";
import { getHomeServices } from "@/features/home/services/home-services.service";

export default async function Home() {
  const [slides, banners, offerBanner, categoryProductSection, services] = await Promise.all([
    getHomeHeroSlides(),
    getHomeBanners(),
    getHomeOfferBanner(),
    getHomeCategoryProductSection(),
    getHomeServices(),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <HomeHeroSection slides={slides} />
      <HomeBannerSection banners={banners} />
      <ProductCollectionSection />
      <HomeOfferBannerSection banner={offerBanner} />
      <HomeCategoryProductSection section={categoryProductSection} />
      <HomeServicesSection services={services} />
    </div>
  );
}
