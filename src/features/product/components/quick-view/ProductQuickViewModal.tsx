"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { ProductQuickViewDetails } from "@/features/product/components/quick-view/ProductQuickViewDetails";
import { ProductQuickViewGallery } from "@/features/product/components/quick-view/ProductQuickViewGallery";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { cn } from "@/lib/utils";

import "./product-quick-view.css";

const QUICK_VIEW_ANIMATION_MS = 360;

interface ProductQuickViewModalProps {
  product: ProductBoxItem;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(onClose, QUICK_VIEW_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn("quick-view-modal-root theme-modal-2", isVisible && "quick-view-modal-root--show")}
      role="presentation"
    >
      <button
        type="button"
        className="quick-view-modal-root__backdrop"
        onClick={handleClose}
        aria-label="Cerrar vista rápida"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="quick-view-modal-root__dialog"
      >
        <div className="modal-content quick-view-modal">
          <div className="modal-header p-0">
            <button
              type="button"
              className="btn btn-close"
              onClick={handleClose}
              aria-label="Cerrar vista rápida"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="modal-body">
            <div className="quick-view-modal__grid">
              <div className="quick-view-modal__gallery-col">
                <div className="sticky-top-custom">
                  <div className="thumbnail-image-slider">
                    <ProductQuickViewGallery product={product} />
                  </div>
                </div>
              </div>

              <div className="quick-view-modal__details-col rtl-text">
                <ProductQuickViewDetails product={product} onClose={handleClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
