/**
 * The site's sections, in the order the navigation lists them. Every path is exactly five
 * letters, and reads as a verb after "Jordan…" (the home page's index).
 *
 * Used by the header, the home page, each section's page, link previews (server/meta.ts)
 * and the card images (scripts/og-images.mjs). Kept free of dependencies for the edge
 * function and Node. (The routes themselves stay in app/router.ts, beside their children.)
 */
export const SECTIONS = [
  {
    name: "works",
    label: "Works",
    /** An icon name from app/icons.ts */
    icon: "briefcase",
    /** "Jordan… works on ambitious web apps" */
    blurb: "on ambitious web apps",
    /** For link previews */
    description: "Work experience, resume, and recommendations.",
  },
  {
    name: "codes",
    label: "Codes",
    icon: "codeXml",
    blurb: "in the open",
    description: "Open-source projects I’ve built and maintain.",
  },
  {
    name: "sound",
    label: "Sound",
    icon: "audioLines",
    blurb: "out as Axle Hellfire",
    description: "Original music I've written and produced.",
  },
  {
    name: "votes",
    label: "Votes",
    icon: "vote",
    blurb: "in every election, with notes",
    description: "Progressive voter guides for current and past elections.",
  },
  {
    name: "reads",
    label: "Reads",
    icon: "bookOpen",
    blurb: "voraciously",
    description: "What I'm reading, my favorite books, and what's next on my shelf.",
  },
  {
    name: "words",
    label: "Words",
    icon: "penLine",
    blurb: "every now and then",
    description: "Blog posts and short-form content.",
  },
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionName = Section["name"];
