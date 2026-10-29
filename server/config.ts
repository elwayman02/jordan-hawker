/**
 * Upstream sources for the /api/* functions.
 *
 * Anything secret comes from Netlify environment variables, never from here.
 */

/** "Publish to web" URL of the resume Google Doc (jhawk.co/resume points here) */
export const RESUME_DOC_URL =
  "https://docs.google.com/document/d/e/2PACX-1vRDZl11201ZpzQLkD8shFgOwo0ARixDMkS0XP1HY5H5-iH37pzrj35-RPMgoW1nvcV_-eWZ3p64Zx2o/pub";

export const GITHUB_USER = "elwayman02";

/** Always shown in the active list, in this order, ahead of ranked repos */
export const FEATURED_REPOS: string[] = [];

/** Never shown */
export const HIDDEN_REPOS: string[] = ["jordan-hawker"];

export const SOUNDCLOUD_USER_ID = "28259228";

export const YOUTUBE_CHANNEL_ID = "UCVYM8upCQAFKXI5VmBqz65w";

export const TUMBLR_BLOG = "jordanhawker.tumblr.com";

export const HELLA_DRUNK_FEED = "https://www.helladrunk.com/rss.xml";

export const USER_AGENT = "jordanhawker.com (+https://github.com/elwayman02/jordan-hawker)";

export function env(name: string): string | undefined {
  return globalThis.Netlify?.env.get(name) ?? process.env[name];
}
