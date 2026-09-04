"use client";

import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import type {
  ProductReviewsResponse,
  ProductReviewUserReview,
} from "@/features/customer-auth/types/customer-auth.types";
import { PdpReviewModal } from "@/features/product/components/pdp/PdpReviewModal";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { cn } from "@/lib/utils";

import "./pdp-reviews.css";

interface PdpReviewsProps {
  product: ProductDetail;
}

function StarRating({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={cn("pdp-reviews__stars", size === "sm" && "pdp-reviews__stars--sm")}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            value >= index + 1 ? "is-filled" : "is-empty",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ReviewStatusMessage({ review }: { review: ProductReviewUserReview }) {
  if (review.status === "pending") {
    return (
      <p className="pdp-reviews__status pdp-reviews__status--pending">
        Tu reseña está pendiente de aprobación.
      </p>
    );
  }

  if (review.status === "rejected") {
    return (
      <p className="pdp-reviews__status pdp-reviews__status--rejected">
        {review.rejectionReason ?? "Tu reseña fue rechazada por moderación."}
      </p>
    );
  }

  return null;
}

export function PdpReviews({ product }: PdpReviewsProps) {
  const { isAuthenticated, openLogin, refreshUser } = useAuth();
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("No se pudieron cargar las reseñas.");
      }

      const json = (await response.json()) as ProductReviewsResponse;
      setData(json);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error al cargar reseñas.");
    } finally {
      setLoading(false);
    }
  }, [product.id]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    setIsModalOpen(true);
  };

  const handleReviewSubmitted = async () => {
    setIsModalOpen(false);
    await refreshUser();
    await loadReviews();
  };

  if (loading) {
    return <p className="pdp-no-content">{PDP_COPY.reviewsLoading}</p>;
  }

  if (error) {
    return <p className="pdp-no-content">{error}</p>;
  }

  if (!data) {
    return <p className="pdp-no-content">{PDP_COPY.noReviews}</p>;
  }

  const { summary, reviews, canReview, purchaseRequired, userReview } = data;
  const distribution = [...summary.ratingDistribution].reverse();

  return (
    <div className="pdp-reviews">
      <div className="pdp-reviews__grid">
        <div className="pdp-reviews__summary">
          {summary.reviewsCount > 0 ? (
            <div className="pdp-reviews__summary-head">
              <h2>{summary.averageRating.toFixed(1)}</h2>
              <div>
                <StarRating value={Math.round(summary.averageRating)} />
                <p className="pdp-reviews__summary-meta">
                  {PDP_COPY.basedOnReviews(summary.reviewsCount)}
                </p>
              </div>
            </div>
          ) : null}

          {summary.reviewsCount > 0 ? (
            <ul className="pdp-reviews__distribution">
              {distribution.map((count, index) => {
                const stars = 5 - index;
                const width = summary.reviewsCount > 0
                  ? Math.round((count / summary.reviewsCount) * 100)
                  : 0;

                return (
                  <li key={stars}>
                    <span className="pdp-reviews__distribution-label">{stars}★</span>
                    <div className="pdp-reviews__distribution-bar">
                      <span style={{ width: `${width}%` }} />
                    </div>
                    <span className="pdp-reviews__distribution-count">{count}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {userReview && userReview.status !== "approved" ? (
            <div className="pdp-reviews__own-review">
              <h4>{PDP_COPY.yourReview}</h4>
              <StarRating value={userReview.rating} size="sm" />
              <p>{userReview.description}</p>
              <ReviewStatusMessage review={userReview} />
            </div>
          ) : canReview ? (
            <div className="pdp-reviews__cta">
              <h4>{PDP_COPY.reviewThisProduct}</h4>
              <p>{PDP_COPY.reviewThisProductHint}</p>
              <button type="button" className="pdp-reviews__write-btn" onClick={handleWriteReview}>
                {PDP_COPY.writeReview}
              </button>
            </div>
          ) : isAuthenticated && purchaseRequired ? (
            <p className="pdp-reviews__notice">{PDP_COPY.purchaseRequiredReview}</p>
          ) : !isAuthenticated ? (
            <div className="pdp-reviews__cta">
              <h4>{PDP_COPY.reviewThisProduct}</h4>
              <p>{PDP_COPY.loginToReview}</p>
              <button type="button" className="pdp-reviews__write-btn" onClick={() => openLogin()}>
                {PDP_COPY.loginToReviewButton}
              </button>
            </div>
          ) : null}
        </div>

        <div className="pdp-reviews__list-wrap">
          {reviews.length > 0 ? (
            <ul className="pdp-reviews__list">
              {reviews.map((review) => (
                <li key={review.id} className="pdp-reviews__item">
                  <div className="pdp-reviews__avatar" aria-hidden>
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="pdp-reviews__item-body">
                    <div className="pdp-reviews__item-head">
                      <strong>{review.authorName}</strong>
                      <time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <p>{review.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pdp-no-content">{PDP_COPY.noReviews}</p>
          )}
        </div>
      </div>

      <PdpReviewModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
