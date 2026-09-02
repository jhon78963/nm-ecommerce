export interface HomeBanner {
  id: string;
  imageUrl: string;
  href: string;
  order: number;
}

export interface PublicBannersResponse {
  banners: HomeBanner[];
}
