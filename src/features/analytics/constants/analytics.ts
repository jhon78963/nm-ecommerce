export const ANALYTICS_CURRENCY = "PEN";

export function getGtmId(): string | undefined {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;
}

export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(getGtmId() || getGaMeasurementId());
}
