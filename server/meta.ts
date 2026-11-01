/**
 * What each page shows when it's linked elsewhere (Discord, Slack, Bluesky…): its title,
 * description and address. Link previews read the HTML without running the app, so
 * netlify/edge-functions/page-meta.ts writes these into index.html as each page is served.
 *
 * Everything comes from the address alone: voter guides say their year and election from
 * their path (/votes/2024 is a general election, /votes/2024/primary a primary).
 */

export const SITE_NAME = "Jordan Hawker";
export const SITE_URL = "https://www.jordanhawker.com";

export interface PageMeta {
  title: string;
  description: string;
  /** Its card image, under public/og (made by `pnpm og-images`: see scripts/og-images.mjs) */
  image: string;
}

/** What the card images show, for screen readers */
const IMAGE_ALT: Record<string, string> = {
  home: "Jordan Hawker, staff software engineer",
  works: "Works, on jordanhawker.com",
  codes: "Codes, on jordanhawker.com",
  sound: "Sound, on jordanhawker.com",
  words: "Words, on jordanhawker.com",
  votes: "Votes, on jordanhawker.com",
};

/** Anything without a page of its own (and the home page) */
export const SITE_META: PageMeta = {
  title: `${SITE_NAME} · Staff software engineer`,
  description:
    "I'm passionate about web applications and developer experience. Also open-source projects, original music, and voter guides.",
  image: "home",
};

const page = (name: string, description: string, image = name.toLowerCase()): PageMeta => ({
  title: `${name} · ${SITE_NAME}`,
  description,
  image,
});

/** The site's sections, as their intros describe them */
const SECTIONS: Record<string, PageMeta> = {
  works: page("Works", "Work experience, resume, and recommendations."),
  codes: page("Codes", "Open-source projects I’ve built and maintain."),
  sound: page("Sound", "Original music I've written and produced."),
  words: page("Words", "Blog posts and short-form content."),
  votes: page("Votes", "Progressive voter guides for current and past elections."),
};

/** The kinds of election a guide's path can name; anything else is a general election */
const ELECTIONS: Record<string, string> = {
  primary: "Primary",
  special: "Special",
  recall: "Recall",
};

/** /votes/2024 → General, /votes/2024/primary → Primary (and so on); else undefined */
function voterGuide(year: string | undefined, kind: string | undefined): PageMeta | undefined {
  if (!year || !/^(?:19|20)\d{2}$/.test(year)) return undefined;

  const election = kind === undefined ? "General" : ELECTIONS[kind.toLowerCase()];

  if (!election) return undefined;

  return page(
    `${year} ${election} Election Voter Guide`,
    `Progressive Voter Guide for the ${year} ${election.toLowerCase()} election.`,
    "votes",
  );
}

/** The preview for a path, e.g. "/votes/2024/primary" */
export function metaFor(pathname: string): PageMeta {
  const [section, ...rest] = pathname.split("/").filter(Boolean);

  if (!section) return SITE_META;
  if (section === "votes" && rest.length) {
    return (rest.length <= 2 && voterGuide(rest[0], rest[1])) || SECTIONS.votes!;
  }

  // posts (/words/some-post) share the Words preview
  return SECTIONS[section] ?? SITE_META;
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
