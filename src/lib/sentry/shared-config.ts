type SentrySharedOptions = {
  dsn?: string;
  enabled: boolean;
  environment: string;
  tracesSampleRate: number;
  release?: string;
};

function parseSampleRate(raw: string | undefined, fallback: number): number {
  if (!raw?.trim()) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return fallback;
  }

  return parsed;
}

export function getSentrySharedOptions(): SentrySharedOptions {
  const dsn =
    process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
    process.env.SENTRY_DSN?.trim() ||
    undefined;

  return {
    dsn,
    enabled: Boolean(dsn) && process.env.SENTRY_ENABLED !== "false",
    environment:
      process.env.SENTRY_ENVIRONMENT?.trim() ||
      process.env.NODE_ENV ||
      "development",
    release: process.env.SENTRY_RELEASE?.trim() || undefined,
    tracesSampleRate: parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0.1),
  };
}
