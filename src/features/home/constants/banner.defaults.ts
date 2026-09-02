import type { HomeBanner } from "@/features/home/types/banner.types";
import { ROUTES } from "@/lib/routes";

export const FALLBACK_HOME_BANNERS: HomeBanner[] = [
  {
    id: "default-0",
    imageUrl: "/images/banners/banner-1.png",
    href: ROUTES.collection("ninos"),
    order: 0,
  },
  {
    id: "default-1",
    imageUrl: "/images/banners/banner-2.png",
    href: ROUTES.collection("jovenes"),
    order: 1,
  },
  {
    id: "default-2",
    imageUrl: "/images/banners/banner-3.png",
    href: ROUTES.collection("ofertas"),
    order: 2,
  },
  {
    id: "default-3",
    imageUrl: "/images/banners/banner-4.png",
    href: "/contacto",
    order: 3,
  },
];

export const BANNERS_REVALIDATE_SECONDS = 300;
