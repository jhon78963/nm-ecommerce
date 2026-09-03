import type {
  CreateProductReviewPayload,
  ProductReviewsResponse,
} from "@/features/customer-auth/types/customer-auth.types";
import { getCustomerAccessToken } from "@/features/customer-auth/utils/customer-auth-cookies";
import { proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function fetchProductReviews(productId: string): Promise<ProductReviewsResponse> {
  const accessToken = await getCustomerAccessToken();

  const response = await proxyEcommerceJson(`/ecommerce/products/${productId}/reviews`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(await readUpstreamError(response));
  }

  return (await response.json()) as ProductReviewsResponse;
}

export async function createProductReview(
  productId: string,
  payload: CreateProductReviewPayload,
) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) {
    throw new Error("Debes iniciar sesión para publicar una reseña.");
  }

  const response = await proxyEcommerceJson(`/ecommerce/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readUpstreamError(response));
  }

  return response.json();
}
