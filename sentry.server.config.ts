import * as Sentry from "@sentry/nextjs";

import { getSentrySharedOptions } from "./src/lib/sentry/shared-config";

const options = getSentrySharedOptions();

Sentry.init({
  dsn: options.dsn,
  enabled: options.enabled,
  environment: options.environment,
  release: options.release,
  tracesSampleRate: options.tracesSampleRate,
});
