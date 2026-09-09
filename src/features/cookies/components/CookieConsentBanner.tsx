"use client";

import Link from "next/link";
import Script from "next/script";

import { useCookieConsent } from "@/features/cookies/context/CookieConsentProvider";
import { ROUTES } from "@/lib/routes";

function getGtmId(): string | undefined {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;
}

function getCloudflareBeaconToken(): string | undefined {
  return process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim() || undefined;
}

export function AnalyticsScripts() {
  const { isReady, hasAnalyticsConsent } = useCookieConsent();
  const gtmId = getGtmId();
  const cfToken = getCloudflareBeaconToken();

  if (!isReady || !hasAnalyticsConsent) {
    return null;
  }

  return (
    <>
      {gtmId ? (
        <>
          <Script id="nm-gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      ) : null}
      {cfToken ? (
        <Script
          id="nm-cf-beacon"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: cfToken })}
        />
      ) : null}
    </>
  );
}

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
