import Image from "next/image";

interface FooterPaymentOptionsProps {
  imageUrl: string;
}

export function FooterPaymentOptions({ imageUrl }: FooterPaymentOptionsProps) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="payment-card-bottom">
      <Image
        src={imageUrl}
        alt="Métodos de pago"
        width={280}
        height={30}
        className="h-[30px] w-auto"
      />
    </div>
  );
}
