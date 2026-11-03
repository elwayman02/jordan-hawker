/**
 * Upstream sources for the /api/* functions.
 *
 * Anything secret comes from Netlify environment variables, never from here.
 */

/** "Publish to web" URL of the resume Google Doc (jhawk.co/resume points here) */
export const RESUME_DOC_URL =
  "https://docs.google.com/document/d/e/2PACX-1vRDZl11201ZpzQLkD8shFgOwo0ARixDMkS0XP1HY5H5-iH37pzrj35-RPMgoW1nvcV_-eWZ3p64Zx2o/pub";

/**
 * Public Google Drive folder of election guides (Google Docs).
 * Every doc in it is listed on /votes, newest election first.
 */
export const VOTES_FOLDER_ID = "1_qrgSdnRQvNQiBBbox1XA-_8BEsCcIfi";

export const GITHUB_USER = "elwayman02";

/** Always shown in the active list, in this order, ahead of ranked repos */
export const FEATURED_REPOS: string[] = [];

/** Never shown */
export const HIDDEN_REPOS: string[] = ["jordan-hawker"];

export const SOUNDCLOUD_USER_ID = "28259228";

/** Only music videos are shown, from this public playlist */
export const YOUTUBE_PLAYLIST_ID = "PL_4QtJfs2R4kxBtVNg9Nxq65Q4gf1jNTZ";

export const TUMBLR_BLOG = "jordanhawker.tumblr.com";

export const HELLA_DRUNK_FEED = "https://www.helladrunk.com/rss.xml";

/**
 * Goodreads user for /reads. Goodreads has no API or RSS any more (the feeds went in Oct 2026),
 * so shelves come from its public bookshelf widget and stats from the public profile page.
 */
/** Last.fm user for the listening section on /sound (API key: LASTFM_API_KEY) */
export const LASTFM_USER = "elwayman02";

export const GOODREADS_USER_ID = "21718161";

export interface CanceledAuthor {
  name: string;
  /** their Goodreads author id (goodreads.com/author/show/<id>) */
  goodreadsId?: string;
  /** pen names they also publish under */
  aliases?: string[];
  /**
   * Titles they co-wrote that Goodreads lists under someone else (the widget only names the
   * first author). Matched against the start of the title.
   */
  coauthored?: string[];
}

/**
 * Authors I've read but won't associate with: none of their books appear anywhere on the
 * site (shelves, favorites, most-read lists), though they still count in Goodreads' totals.
 */
export const CANCELED_AUTHORS: CanceledAuthor[] = [
  { name: "J.K. Rowling", goodreadsId: "1077326", aliases: ["Robert Galbraith"] },
  { name: "Neil Gaiman", goodreadsId: "1221698", coauthored: ["Good Omens"] },
  { name: "Orson Scott Card", goodreadsId: "589" },
];

export const USER_AGENT = "jordanhawker.com (+https://github.com/elwayman02/jordan-hawker)";

export function env(name: string): string | undefined {
  return globalThis.Netlify?.env.get(name) ?? process.env[name];
}
