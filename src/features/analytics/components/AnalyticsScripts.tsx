"use client";

import Script from "next/script";

import { getGaMeasurementId, getGtmId } from "@/features/analytics/constants/analytics";
import { useCookieConsent } from "@/features/cookies/context/CookieConsentProvider";

function buildConsentBootstrapScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500,
    });
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  `;
}

function getCloudflareBeaconToken(): string | undefined {
  return process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim() || undefined;
}

export function AnalyticsScripts() {
  const { isReady, hasAnalyticsConsent } = useCookieConsent();
  const gtmId = getGtmId();
  const gaMeasurementId = getGaMeasurementId();
  const cfToken = getCloudflareBeaconToken();

  if (!isReady || !hasAnalyticsConsent) {
    return null;
  }

  return (
    <>
      <Script id="nm-analytics-consent" strategy="afterInteractive">
        {buildConsentBootstrapScript()}
      </Script>

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

      {!gtmId && gaMeasurementId ? (
        <>
          <Script
            id="nm-ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="nm-ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false });
            `}
          </Script>
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
