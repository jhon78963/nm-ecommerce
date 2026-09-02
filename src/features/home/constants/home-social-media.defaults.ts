import type { HomeSocialMediaConfig } from "@/features/home/types/home-social-media.types";

export const HOME_SOCIAL_MEDIA_REVALIDATE_SECONDS = 300;

const TIKTOK_PROFILE_URL = "https://www.tiktok.com/";

/** marketplace_one.json → content.social_media (adaptado a TikTok) */
export const FALLBACK_HOME_SOCIAL_MEDIA: HomeSocialMediaConfig = {
  status: true,
  title: "# TIKTOK",
  platform: "tiktok",
  profileUrl: TIKTOK_PROFILE_URL,
  banners: [
    {
      id: "tiktok-6",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_6.png",
      href: TIKTOK_PROFILE_URL,
    },
    {
      id: "tiktok-5",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_5.png",
      href: TIKTOK_PROFILE_URL,
    },
    {
      id: "tiktok-4",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_4.png",
      href: TIKTOK_PROFILE_URL,
    },
    {
      id: "tiktok-3",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_3.png",
      href: TIKTOK_PROFILE_URL,
    },
    {
      id: "tiktok-2",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_2.png",
      href: TIKTOK_PROFILE_URL,
    },
    {
      id: "tiktok-1",
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_insta_1.png",
      href: TIKTOK_PROFILE_URL,
    },
  ],
};
