import { parse, type HTMLElement, NodeType } from "node-html-parser";
import sanitizeHtml from "sanitize-html";

import type { VoteGuide, VoteGuideSection, VotePick, Votes } from "../shared/api.ts";
import { VOTES_FOLDER_ID } from "./config.ts";
import { fetchText } from "./fetch.ts";
import { escape, readClassStyles, segmentsOf, segmentsToHtml, segmentsToText } from "./gdoc.ts";

export interface FolderEntry {
  id: string;
  name: string;
}

/**
 * Drive's embeddable folder view lists a public folder's files without an API key.
 * Only Google Docs are kept.
 */
export function parseFolder(html: string): FolderEntry[] {
  return parse(html)
    .querySelectorAll(".flip-entry")
    .flatMap((entry) => {
      const href = entry.querySelector("a")?.getAttribute("href") ?? "";
      const id = /\/document\/d\/([\w-]+)/.exec(href)?.[1];
      const name = entry.querySelector(".flip-entry-title")?.text.trim();

      return id && name ? [{ id, name }] : [];
    });
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Reads the election from a guide's name, e.g.
 * "2024 Progressive Voter Guide - CA/Alameda/Hayward - March Primary" → March 2024 Primary.
 * Without a month, primaries are assumed to be in June and everything else in November.
 *
 * The slug is the guide's path under /votes: just the year for a general election
 * ("2024"), and the year plus the kind for anything else ("2024/primary").
 */
export function parseElection(name: string) {
  const year = /\b(?:19|20)\d{2}\b/.exec(name)?.[0];

  if (!year) return undefined;

  const kind = /\bprimary\b/i.test(name)
    ? "Primary"
    : /\bspecial\b/i.test(name)
      ? "Special"
      : /\brecall\b/i.test(name)
        ? "Recall"
        : "General";

  const named = MONTHS.findIndex((month) =>
    new RegExp(`\\b${month.slice(0, 3)}(?:${month.slice(3)})?\\b`, "i").test(name),
  );
  const month = named >= 0 ? named : kind === "Primary" ? 5 : 10;
  const monthName = MONTHS[month]!;

  return {
    slug: kind === "General" ? year : `${year}/${kind.toLowerCase()}`,
    label: `${monthName} ${year} ${kind}`,
    election: `${year}-${String(month + 1).padStart(2, "0")}-01`,
  };
}

/** "Proposition 1: Affordable Housing - YES" → ["Proposition 1: Affordable Housing", "yes"] */
function splitPick(text: string): [string, VotePick | undefined] {
  const match = /^(.*?)\s+[-–—]\s*(yes|no)$/i.exec(text);

  return match ? [match[1]!, match[2]!.toLowerCase() as VotePick] : [text, undefined];
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "section"
  );
}

const sanitizeGuide = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "strong", "em", "a", "span", "br"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
      span: ["class"],
    },
    allowedClasses: { span: ["pick", "pick--yes", "pick--no"] },
    allowedSchemes: ["http", "https", "mailto"],
  });

/**
 * Turns a Google Doc into clean, semantic HTML plus an outline.
 * Doc headings shift down two levels (Heading 1 → <h3>): the page has its own <h1>,
 * and the guide's title is its <h2>.
 */
export function parseGuide(
  page: string,
): Pick<VoteGuide, "title" | "subtitle" | "body" | "outline"> {
  const root = parse(page);
  const classes = readClassStyles(
    root
      .querySelectorAll("style")
      .map((style) => style.text)
      .join(""),
  );
  // The lightweight view wraps the document in .doc-content; the HTML export doesn't.
  const body = root.querySelector(".doc-content") ?? root.querySelector("body");

  const ids = new Set<string>();
  const uniqueId = (text: string) => {
    const base = slugify(text);
    let id = base;

    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);

    return id;
  };

  let title = "";
  let subtitle: string | undefined;
  const outline: VoteGuideSection[] = [];
  const html: string[] = [];

  const inline = (element: HTMLElement) => segmentsToHtml(segmentsOf(element, classes));

  for (const node of body?.childNodes ?? []) {
    if (node.nodeType !== NodeType.ELEMENT_NODE) continue;

    const element = node as HTMLElement;
    const tag = element.tagName;

    if (tag === "P" && element.classList.contains("title")) {
      title ||= segmentsToText(segmentsOf(element, classes));
    } else if (tag === "P" && element.classList.contains("subtitle")) {
      subtitle ||= segmentsToText(segmentsOf(element, classes)) || undefined;
    } else if (/^H[1-6]$/.test(tag)) {
      const text = segmentsToText(segmentsOf(element, classes));

      if (!text) continue;

      const level = Number(tag[1]);
      const [heading, pick] = level === 2 ? splitPick(text) : [text, undefined];
      const id = uniqueId(heading);
      const badge = pick ? ` <span class="pick pick--${pick}">${pick}</span>` : "";

      const h = `h${Math.min(level + 2, 6)}`;

      html.push(`<${h} id="${id}">${escape(heading)}${badge}</${h}>`);

      if (level === 1) {
        outline.push({ id, title: heading, items: [] });
      } else if (level === 2) {
        if (!outline.length) outline.push({ id: "", title: "", items: [] });
        outline.at(-1)!.items.push({ id, title: heading, ...(pick && { pick }) });
      }
    } else if (tag === "UL" || tag === "OL") {
      const items = element
        .querySelectorAll("li")
        .map(inline)
        .filter(Boolean)
        .map((item) => `<li>${item}</li>`);

      if (items.length) html.push(`<${tag.toLowerCase()}>${items.join("")}</${tag.toLowerCase()}>`);
    } else {
      const content = inline(element);

      if (content) html.push(`<p>${content}</p>`);
    }
  }

  return { title, subtitle, body: sanitizeGuide(html.join("\n")), outline };
}

/** Links from one guide to another (by Google Doc id) open that guide on the site instead */
export function linkGuides(html: string, slugs: Map<string, string>): string {
  return html.replace(
    /<a href="https:\/\/docs\.google\.com\/document\/d\/([\w-]+)[^"]*" target="_blank" rel="noopener noreferrer">/g,
    (link, id: string) => (slugs.has(id) ? `<a href="/votes/${slugs.get(id)}">` : link),
  );
}

export async function getVotes(): Promise<Votes> {
  const entries = parseFolder(
    await fetchText(`https://drive.google.com/embeddedfolderview?id=${VOTES_FOLDER_ID}`),
  );

  // An empty listing most likely means Google changed the page; keep serving the last good one.
  if (!entries.length) throw new Error("No guides found in the votes folder");

  const loaded = await Promise.all(
    entries.map(async ({ id, name }): Promise<[docId: string, guide: VoteGuide]> => {
      // The lightweight view is consistently fast; the HTML export can take 40s+ for some docs.
      // A doc that isn't public redirects to a sign-in page: treat that as a failure, not a guide.
      const doc = parseGuide(
        await fetchText(`https://docs.google.com/document/d/${id}/mobilebasic`, {
          redirect: "manual",
        }),
      );
      const election = parseElection(name) ?? parseElection(doc.title);

      return [
        id,
        {
          slug: election?.slug ?? id,
          label: election?.label ?? name,
          election: election?.election ?? "",
          ...doc,
          title: doc.title || name,
          url: `https://docs.google.com/document/d/${id}/edit`,
        },
      ];
    }),
  );

  loaded.sort(([, a], [, b]) => b.election.localeCompare(a.election));

  // doc id → slug, with slugs kept unique (e.g. two guides for the same election)
  const slugs = new Map<string, string>();

  for (const [id, guide] of loaded) {
    const taken = new Set(slugs.values());

    while (taken.has(guide.slug)) guide.slug += "-2";
    slugs.set(id, guide.slug);
  }

  const guides = loaded.map(([, guide]) => ({ ...guide, body: linkGuides(guide.body, slugs) }));

  return { guides };
}
