"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface AccountModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AccountModal({ title, isOpen, onClose, children }: AccountModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
      <button type="button" className="account-modal__backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="account-modal__panel">
        <div className="account-modal__header">
          <h3 id="account-modal-title">{title}</h3>
          <button type="button" className="account-modal__close" onClick={onClose} aria-label="Cerrar">
            <X className="size-4" />
          </button>
        </div>
        <div className="account-modal__body">{children}</div>
      </div>
    </div>
  );
}
