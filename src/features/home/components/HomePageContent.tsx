import { Suspense } from "react";

import { HomeBannerSection } from "@/features/home/components/banners/HomeBannerSection";
import { HomeOfferBannerSection } from "@/features/home/components/banners/HomeOfferBannerSection";
import { HomeCategoryProductSection } from "@/features/home/components/category-products/HomeCategoryProductSection";
import { ProductCollectionSection } from "@/features/home/components/collections/ProductCollectionSection";
import { HomeHeroSection } from "@/features/home/components/hero/HomeHeroSection";
import { HomeServicesSection } from "@/features/home/components/services/HomeServicesSection";
import { HomeSocialMediaSection } from "@/features/home/components/social-media/HomeSocialMediaSection";
import { getHomeBanners } from "@/features/home/services/banner.service";
import { getHomeCategoryProductSection } from "@/features/home/services/category-product.service";
import { getHomeCollections } from "@/features/home/services/collections.service";
import { getHomeHeroSlides } from "@/features/home/services/hero.service";
import { getHomeOfferBanner } from "@/features/home/services/offer-banner.service";
import { getHomeServices } from "@/features/home/services/home-services.service";
import { getHomeSocialMedia } from "@/features/home/services/home-social-media.service";
import { cn } from "@/lib/utils";

function HomeSectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-[#f3f3f3]", className)}
      aria-hidden="true"
    />
  );
}

async function HomeHeroSectionAsync() {
  const slides = await getHomeHeroSlides();
  return <HomeHeroSection slides={slides} />;
}

async function HomeBannersSectionAsync() {
  const banners = await getHomeBanners();
  return <HomeBannerSection banners={banners} />;
}

async function HomeCollectionsSectionAsync() {
  const collections = await getHomeCollections();

  return (
    <>
      {collections.map((collection) => (
        <ProductCollectionSection
          key={collection.id}
          config={collection}
          products={collection.products}
        />
      ))}
    </>
  );
}

async function HomeOfferBannerSectionAsync() {
  const offerBanner = await getHomeOfferBanner();
  return <HomeOfferBannerSection banner={offerBanner} />;
}

async function HomeCategoryProductsSectionAsync() {
  const categoryProductSection = await getHomeCategoryProductSection();
  return <HomeCategoryProductSection section={categoryProductSection} />;
}

async function HomeServicesSectionAsync() {
  const services = await getHomeServices();
  return <HomeServicesSection services={services} />;
}

async function HomeSocialMediaSectionAsync() {
  const socialMedia = await getHomeSocialMedia();
  return <HomeSocialMediaSection socialMedia={socialMedia} />;
}

export function HomePageContent() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Suspense fallback={<HomeSectionSkeleton className="h-[min(56vw,520px)] w-full" />}>
        <HomeHeroSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-32 w-[min(100%,1400px)] px-4" />}>
        <HomeBannersSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-80 w-[min(100%,1400px)] px-4" />}>
        <HomeCollectionsSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-40 w-[min(100%,1400px)] px-4" />}>
        <HomeOfferBannerSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-96 w-[min(100%,1400px)] px-4" />}>
        <HomeCategoryProductsSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-48 w-[min(100%,1400px)] px-4" />}>
        <HomeServicesSectionAsync />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton className="mx-auto my-6 h-56 w-[min(100%,1400px)] px-4" />}>
        <HomeSocialMediaSectionAsync />
      </Suspense>
    </div>
  );
}
