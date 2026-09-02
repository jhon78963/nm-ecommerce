import { ServiceBlock } from "@/features/home/components/services/ServiceBlock";
import type { HomeServiceItem } from "@/features/home/types/home-services.types";
import { getServiceGridClass } from "@/features/home/utils/service-grid";

import "./home-services.css";

interface ThemeServicesProps {
  services: HomeServiceItem[];
}

export function ThemeServices({ services }: ThemeServicesProps) {
  if (services.length === 0) {
    return null;
  }

  const gridClass = getServiceGridClass(services.length);

  return (
    <div className={`home-services-grid ${gridClass}`}>
      {services.map((service) => (
        <div key={service.id} className="home-services-grid__item">
          <ServiceBlock service={service} />
        </div>
      ))}
    </div>
  );
}
