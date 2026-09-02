export interface HomeOfferBanner {
  id: string;
  imageUrl: string;
  href: string;
  alt?: string;
  status?: boolean;
}

export interface PublicOfferBannerResponse {
  banner: HomeOfferBanner | null;
}
