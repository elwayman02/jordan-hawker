/**
 * The site's identity, shared by the app, link previews (server/meta.ts) and the card
 * images (scripts/og-images.mjs). Kept free of dependencies for the edge function and Node.
 */
export const SITE_NAME = "Jordan Hawker";
export const SITE_HOST = "jordanhawker.com";
export const SITE_URL = `https://www.${SITE_HOST}`;
