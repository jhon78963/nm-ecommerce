import type { ValidateCouponPayload, ValidatedCoupon } from "@/features/checkout/types/coupon.types";

export class CouponApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CouponApiError";
  }
}

export async function validateCheckoutCoupon(
  payload: ValidateCouponPayload,
): Promise<ValidatedCoupon> {
  const response = await fetch("/api/checkout/coupons/validate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Cupón inválido.";

    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // ignore parse errors
    }

    throw new CouponApiError(message, response.status);
  }

  return response.json() as Promise<ValidatedCoupon>;
}
