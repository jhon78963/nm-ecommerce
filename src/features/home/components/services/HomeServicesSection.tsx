import { ThemeServices } from "@/features/home/components/services/ThemeServices";
import type { HomeServiceItem } from "@/features/home/types/home-services.types";

interface HomeServicesSectionProps {
  services: HomeServiceItem[];
}

export function HomeServicesSection({ services }: HomeServicesSectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-[15px]">
      <section className="home-services-section service border-section small-section">
        <ThemeServices services={services} />
      </section>
    </div>
  );
}
