/**
 * What each page shows when it's linked elsewhere (Discord, Slack, Bluesky…): its title,
 * description and address. Link previews read the HTML without running the app, so
 * netlify/edge-functions/page-meta.ts writes these into index.html as each page is served.
 *
 * Everything comes from the address alone: voter guides say their year and election from
 * their path (/votes/2024 is a general election, /votes/2024/primary a primary).
 */

import { readElectionSlug } from "../shared/elections.ts";
import { SECTIONS, type SectionName } from "../shared/sections.ts";
import { SITE_HOST, SITE_NAME, SITE_URL } from "../shared/site.ts";
import { escape } from "./escape.ts";

export interface PageMeta {
  title: string;
  description: string;
  /** Its card image, under public/og (made by `pnpm og-images`: see scripts/og-images.mjs) */
  image: string;
}

/** What the card images show, for screen readers */
const IMAGE_ALT: Record<string, string> = {
  home: `${SITE_NAME}, staff software engineer`,
  ...Object.fromEntries(SECTIONS.map(({ name, label }) => [name, `${label}, on ${SITE_HOST}`])),
};

/** Anything without a page of its own (and the home page) */
export const SITE_META: PageMeta = {
  title: `${SITE_NAME} · Staff software engineer`,
  description:
    "I'm passionate about web applications and developer experience. Also open-source projects, original music, and voter guides.",
  image: "home",
};

const page = (title: string, description: string, image: string): PageMeta => ({
  title: `${title} · ${SITE_NAME}`,
  description,
  image,
});

/** The site's sections, as their intros describe them */
const SECTION_META = Object.fromEntries(
  SECTIONS.map(({ name, label, description }) => [name, page(label, description, name)]),
) as Record<SectionName, PageMeta>;

const isSection = (name: string): name is SectionName => Object.hasOwn(SECTION_META, name);

/** /votes/2024 → General, /votes/2024/primary → Primary (and so on); else undefined */
function voterGuide(slug: string): PageMeta | undefined {
  const election = readElectionSlug(slug);

  if (!election) return undefined;

  const { year, kind } = election;

  return page(
    `${year} ${kind} Election Voter Guide`,
    `Progressive Voter Guide for the ${year} ${kind.toLowerCase()} election.`,
    "votes",
  );
}

/** The preview for a path, e.g. "/votes/2024/primary" */
export function metaFor(pathname: string): PageMeta {
  const [section, ...rest] = pathname.split("/").filter(Boolean);

  if (!section) return SITE_META;
  if (section === "votes" && rest.length) {
    return voterGuide(rest.join("/")) ?? SECTION_META.votes;
  }

  // posts (/words/some-post) share the Words preview
  return isSection(section) ? SECTION_META[section] : SITE_META;
}

/** Marks the tags in index.html that change from page to page */
export const START = "<!-- page meta -->";
export const END = "<!-- /page meta -->";

/**
 * The page's tags, ready for index.html. `url` is its canonical (production) address;
 * images come from `origin`, wherever the page is being served (a deploy preview has them
 * before production does).
 */
export function renderMeta(
  { title, description, image }: PageMeta,
  url: string,
  origin: string = SITE_URL,
): string {
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${escape(origin)}/og/${image}.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(IMAGE_ALT[image] ?? title)}" />`,
  ].join("\n    ");
}

/**
 * Swaps index.html's page tags (between START and END) for the ones for `url`.
 * Anything without those markers comes back untouched.
 */
export function withMeta(html: string, url: URL): string {
  const start = html.indexOf(START);
  const end = html.indexOf(END, start);

  if (start < 0 || end < 0) return html;

  const canonical = `${SITE_URL}${url.pathname.replace(/\/+$/, "") || "/"}`;

  return (
    html.slice(0, start + START.length) +
    "\n    " +
    renderMeta(metaFor(url.pathname), canonical, url.origin) +
    "\n    " +
    html.slice(end)
  );
}
