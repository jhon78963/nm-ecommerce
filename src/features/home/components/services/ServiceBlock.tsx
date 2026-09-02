import { StoreImage } from "@/components/ui/StoreImage";

import type { HomeServiceItem } from "@/features/home/types/home-services.types";

import "./home-services.css";

interface ServiceBlockProps {
  service: HomeServiceItem;
}

export function ServiceBlock({ service }: ServiceBlockProps) {
  return (
    <div className="home-service-block">
      <div className="media">
        <StoreImage
          src={service.imageUrl}
          alt={service.title}
          width={60}
          height={60}
          className="home-service-block__image"
        />

        <div className="media-body">
          <h4 className="home-service-block__title">{service.title}</h4>
          <p className="home-service-block__description">{service.description}</p>
        </div>
      </div>
    </div>
  );
}
