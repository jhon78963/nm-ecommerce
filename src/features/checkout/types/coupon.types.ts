export type CouponDiscountType = "percentage" | "fixed";

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
  customerId?: string;
}

export interface ValidatedCoupon {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  discountAmount: number;
  description?: string | null;
}

export interface WelcomeCoupon {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  description?: string | null;
}

export function formatCouponDiscount(coupon: {
  discountType: CouponDiscountType;
  discountValue: number;
}): string {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}% de descuento`;
  }

  return `S/ ${coupon.discountValue.toFixed(2)} de descuento`;
}
