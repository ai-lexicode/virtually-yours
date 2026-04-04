import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  beforeSend(event) {
    // Scrub PII from event data
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }
    if (event.request?.cookies) {
      event.request.cookies = {};
    }
    // Scrub sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data) {
          const sensitiveKeys = ["password", "token", "secret", "key", "authorization"];
          for (const key of Object.keys(breadcrumb.data)) {
            if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
              breadcrumb.data[key] = "[Filtered]";
            }
          }
        }
        return breadcrumb;
      });
    }
    return event;
  },
});
