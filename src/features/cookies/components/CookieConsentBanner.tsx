"use client";

import Link from "next/link";

import { useCookieConsent } from "@/features/cookies/context/CookieConsentProvider";
import { ROUTES } from "@/lib/routes";

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <section
      className="nm-cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Preferencias de cookies"
    >
      <div className="nm-cookie-banner__inner container">
        <div className="nm-cookie-banner__copy">
          <p className="nm-cookie-banner__title">Usamos cookies</p>
          <p className="nm-cookie-banner__text">
            Utilizamos cookies necesarias para el carrito, la sesión y la compra. Con tu
            consentimiento también podemos usar cookies de análisis para mejorar la tienda.
            {" "}
            <Link href={ROUTES.institutional.cookies} className="nm-cookie-banner__link">
              Política de Cookies
            </Link>
          </p>
        </div>
        <div className="nm-cookie-banner__actions">
          <button type="button" className="nm-cookie-banner__btn nm-cookie-banner__btn--ghost" onClick={rejectNonEssential}>
            Solo necesarias
          </button>
          <button type="button" className="nm-cookie-banner__btn nm-cookie-banner__btn--primary" onClick={acceptAll}>
            Aceptar todas
          </button>
        </div>
      </div>
    </section>
  );
}

export function CookiePreferencesTrigger() {
  const { openPreferences } = useCookieConsent();

  return (
    <button type="button" className="nm-cookie-preferences-trigger" onClick={openPreferences}>
      Gestionar cookies
    </button>
  );
}
