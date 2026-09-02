import { StoreImage } from "@/components/ui/StoreImage";

interface ShopBannerProps {
  imageUrl: string;
  alt: string;
}

export function ShopBanner({ imageUrl, alt }: ShopBannerProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-sm">
      <StoreImage
        src={imageUrl}
        alt={alt}
        width={900}
        height={220}
        className="h-[160px] w-full object-cover md:h-[200px]"
        priority
      />
    </div>
  );
}
