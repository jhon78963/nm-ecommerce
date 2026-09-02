export interface HomeServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status?: boolean;
}

export interface HomeServicesConfig {
  status?: boolean;
  services: HomeServiceItem[];
}

/** Respuesta esperada de GET /api/v1/ecommerce/home/services */
export interface PublicHomeServicesResponse {
  services: HomeServicesConfig | null;
}
