import type { HomeServicesConfig } from "@/features/home/types/home-services.types";

export const HOME_SERVICES_REVALIDATE_SECONDS = 300;

/** marketplace_one.json → content.services */
export const FALLBACK_HOME_SERVICES: HomeServicesConfig = {
  status: true,
  services: [
    {
      id: "service-1",
      title: "Envío gratis",
      description: "Envío gratis a todo el mundo",
      imageUrl: "/images/theme/marketplace_one/service.png",
      status: true,
    },
    {
      id: "service-2",
      title: "Servicio 24/7",
      description: "Atención online para clientes",
      imageUrl: "/images/theme/marketplace_one/service.png",
      status: true,
    },
    {
      id: "service-3",
      title: "Oferta especial",
      description: "Nueva oferta especial online",
      imageUrl: "/images/theme/marketplace_one/service.png",
      status: true,
    },
  ],
};
