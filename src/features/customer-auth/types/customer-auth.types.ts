export interface CustomerUser {
  id: string;
  email: string;
  name: string;
}

export interface CustomerAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  customer: CustomerUser;
}

export interface ProductReviewItem {
  id: string;
  authorName: string;
  rating: number;
  description: string;
  createdAt: string;
}

export interface ProductReviewUserReview extends ProductReviewItem {
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
}

export interface ProductReviewsResponse {
  reviews: ProductReviewItem[];
  summary: {
    averageRating: number;
    reviewsCount: number;
    ratingDistribution: number[];
  };
  canReview: boolean;
  purchaseRequired: boolean;
  userReview: ProductReviewUserReview | null;
}

export interface CreateProductReviewPayload {
  rating: number;
  description: string;
}
