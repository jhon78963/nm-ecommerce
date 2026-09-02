export type SocialMediaPlatform = "tiktok" | "instagram";

export interface HomeSocialMediaBanner {
  id: string;
  status?: boolean;
  imageUrl: string;
  href: string;
}

export interface HomeSocialMediaConfig {
  status?: boolean;
  title: string;
  platform: SocialMediaPlatform;
  profileUrl?: string;
  banners: HomeSocialMediaBanner[];
}

/** Respuesta esperada de GET /api/v1/ecommerce/home/social-media */
export interface PublicHomeSocialMediaResponse {
  socialMedia: HomeSocialMediaConfig | null;
}
