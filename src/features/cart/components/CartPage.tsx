import { CartPageContent } from "@/features/cart/components/CartPageContent";

export function CartPage() {
  return (
    <section className="cart-section pb-[70px] pt-0">
      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8 md:py-12">
        <CartPageContent />
      </div>
    </section>
  );
}
