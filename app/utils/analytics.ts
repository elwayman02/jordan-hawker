import config from "#config";

/**
 * Cloudflare Web Analytics: free, cookieless, no consent banner needed.
 * Its beacon follows single-page navigations on its own (`spa: true`).
 *
 * Enabled when VITE_CLOUDFLARE_ANALYTICS_TOKEN is set at build time.
 */
export function setupAnalytics() {
  const token = config.cloudflareAnalyticsToken;

  if (!token || config.environment !== "production") return;

  const script = document.createElement("script");

  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.dataset.cfBeacon = JSON.stringify({ token, spa: true });
  document.head.append(script);
}
