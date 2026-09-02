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
        style={{ width: "auto", height: 30 }}
      />
    </div>
  );
}
