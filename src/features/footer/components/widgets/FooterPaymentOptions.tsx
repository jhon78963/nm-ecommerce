import { StoreImage } from "@/components/ui/StoreImage";

interface FooterPaymentOptionsProps {
  imageUrl: string;
}

export function FooterPaymentOptions({ imageUrl }: FooterPaymentOptionsProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="payment-card-bottom">
      <StoreImage
        src={imageUrl}
        alt="Métodos de pago"
        width={280}
        height={30}
        style={{ width: "auto", height: 30 }}
      />
    </div>
  );
}
