"use client";

import { Star, X } from "lucide-react";
import { useState } from "react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { cn } from "@/lib/utils";

interface PdpReviewModalProps {
  product: ProductDetail;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export function PdpReviewModal({
  product,
  isOpen,
  onClose,
  onSubmitted,
}: PdpReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (rating < 1) {
      setError(PDP_COPY.reviewRatingRequired);
      return;
    }

    if (description.trim().length < 10) {
      setError(PDP_COPY.reviewDescriptionRequired);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, description: description.trim() }),
      });

      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(body.message ?? PDP_COPY.reviewSubmitError);
      }

      setRating(0);
      setDescription("");
      onSubmitted();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : PDP_COPY.reviewSubmitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pdp-review-modal" role="dialog" aria-modal="true" aria-labelledby="pdp-review-title">
      <button type="button" className="pdp-review-modal__backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="pdp-review-modal__panel">
        <div className="pdp-review-modal__header">
          <h3 id="pdp-review-title">{PDP_COPY.writeReview}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>

        <form className="pdp-review-modal__form" onSubmit={handleSubmit}>
          <p className="pdp-review-modal__product">{product.name}</p>

          <label className="pdp-review-modal__label">{PDP_COPY.reviewRatingLabel}</label>
          <div className="pdp-review-modal__stars">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const filled = rating >= value;

              return (
                <button
                  key={value}
                  type="button"
                  className={cn("pdp-review-modal__star-btn", filled && "is-filled")}
                  onClick={() => setRating(value)}
                  aria-label={`${value} estrellas`}
                >
                  <Star className="size-6" />
                </button>
              );
            })}
          </div>

          <label htmlFor="review-description" className="pdp-review-modal__label">
            {PDP_COPY.reviewContentLabel}
          </label>
          <textarea
            id="review-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            maxLength={2000}
            placeholder={PDP_COPY.reviewContentPlaceholder}
            className="pdp-review-modal__textarea"
          />

          {error ? <p className="pdp-review-modal__error">{error}</p> : null}

          <div className="pdp-review-modal__actions">
            <button type="button" className="pdp-review-modal__cancel" onClick={onClose}>
              {PDP_COPY.reviewCancel}
            </button>
            <button type="submit" className="pdp-review-modal__submit" disabled={submitting}>
              {submitting ? PDP_COPY.reviewSubmitting : PDP_COPY.reviewSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
