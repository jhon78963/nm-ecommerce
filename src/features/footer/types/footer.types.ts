export interface FooterLinkItem {
  id: string;
  name: string;
  href: string;
}

export interface FooterCategoryItem {
  id: string;
  name: string;
  href: string;
}

export interface StoreFooterConfig {
  newsletterTitle: string;
  newsletterSubtitle: string;
  aboutText: string;
  address: string;
  supportNumber: string;
  supportEmail: string;
  socialMediaEnabled: boolean;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  pinterestUrl?: string;
  tiktokUrl?: string;
  categories: FooterCategoryItem[];
  usefulLinks: FooterLinkItem[];
  helpCenterLinks: FooterLinkItem[];
  copyrightEnabled: boolean;
  copyrightContent: string;
  paymentImageUrl?: string;
}

/** Respuesta esperada de GET /api/v1/ecommerce/footer */
export interface PublicFooterResponse {
  footer: StoreFooterConfig | null;
}
