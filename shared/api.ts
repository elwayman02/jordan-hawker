/**
 * Response shapes shared by the Netlify Functions (server/) and the app.
 *
 * Every /api/* endpoint responds with an `ApiResponse<T>` envelope.
 */

export interface ApiResponse<T> {
  data: T;
  /** ISO timestamp of when the upstream source was last fetched successfully */
  fetchedAt: string;
  /** true when the upstream failed and this is the last known good snapshot */
  stale: boolean;
}

/* ---------------------------------- resume --------------------------------- */

export type ResumeLineLevel = "org" | "role" | "text";

export interface ResumeLine {
  kind: "line";
  level: ResumeLineLevel;
  /** sanitized inline HTML (strong/em/a only) */
  left: string;
  /** plain text shown right-aligned (dates, locations, venues) */
  right?: string;
}

export interface ResumeList {
  kind: "list";
  /** sanitized inline HTML per item */
  items: string[];
}

export type ResumeBlock = ResumeLine | ResumeList;

export interface ResumeSection {
  title: string;
  blocks: ResumeBlock[];
}

export interface ResumeRole {
  title: string;
  dates?: string;
  highlights: string[];
}

export interface ResumeExperience {
  org: string;
  location?: string;
  roles: ResumeRole[];
}

export interface Resume {
  name: string;
  /** lines between the name and the first section (sanitized inline HTML) */
  intro: string[];
  sections: ResumeSection[];
  /** best-effort structured view of the EXPERIENCE section */
  experience: ResumeExperience[];
  /**
   * The document as Google renders it (sanitized), used as a fallback
   * when the structure above could not be recognized.
   */
  original: { html: string; css: string };
  /** false when the structured parse looks wrong; the UI then shows `original` */
  structured: boolean;
}

/* ---------------------------------- codes ---------------------------------- */

/** Star counts below this undersell a project more than they help, so the site hides them */
export const MIN_STARS_SHOWN = 10;

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  createdAt: string;
  score: number;
  featured: boolean;
}

export interface Codes {
  /** ranked, most relevant first */
  active: Repo[];
  /** older or low-signal repos, newest first */
  archive: Repo[];
}

/* ---------------------------------- sound ---------------------------------- */

export interface Track {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  duration?: string;
  artwork?: string;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
}

export interface Sound {
  tracks: Track[];
  videos: Video[];
}

/* ---------------------------------- words ---------------------------------- */

export interface PostSummary {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  url: string;
}

export interface Post extends PostSummary {
  /** sanitized HTML */
  body: string;
}

export interface Words {
  posts: Post[];
}

/* ------------------------------- hella drunk ------------------------------- */

export interface HellaPost {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
}

export interface Hella {
  posts: HellaPost[];
}

/* ---------------------------------- votes ---------------------------------- */

export type VotePick = "yes" | "no";

export interface VoteGuideItem {
  /** anchor in `body` */
  id: string;
  title: string;
  /** for ballot measures whose heading ends in "- YES" / "- NO" */
  pick?: VotePick;
}

export interface VoteGuideSection {
  id: string;
  title: string;
  items: VoteGuideItem[];
}

export interface VoteGuide {
  /** e.g. "2026-november-general" */
  slug: string;
  /** e.g. "November 2026 General" */
  label: string;
  /** first of the election month, YYYY-MM-01 */
  election: string;
  title: string;
  subtitle?: string;
  /** the Google Doc */
  url: string;
  /** sanitized HTML, headings carry ids from `outline` */
  body: string;
  outline: VoteGuideSection[];
}

export interface Votes {
  /** newest election first */
  guides: VoteGuide[];
}
