import { parse, type HTMLElement, NodeType } from "node-html-parser";
import sanitizeHtml from "sanitize-html";

import type {
  Resume,
  ResumeBlock,
  ResumeExperience,
  ResumeLine,
  ResumeSection,
} from "../shared/api.ts";
import { RESUME_DOC_URL } from "./config.ts";
import { fetchText } from "./fetch.ts";
import {
  readClassStyles,
  type Segment,
  segmentsOf,
  segmentsToHtml,
  segmentsToText,
} from "./gdoc.ts";
import { unwrapLink } from "./html.ts";

export async function getResume(): Promise<Resume> {
  return parseResume(await fetchText(RESUME_DOC_URL));
}

/** Runs of 2+ non-breaking spaces (or tabs) separate "left" from "right" columns */
const COLUMN_GAP = /[\u00a0\t]{2,}|\t/;

/** Split segments at the first column gap */
function splitColumns(segments: Segment[]): [Segment[], Segment[]] {
  const left: Segment[] = [];
  const right: Segment[] = [];
  let target = left;

  for (const segment of segments) {
    const match = target === left ? COLUMN_GAP.exec(segment.text) : null;

    if (match) {
      left.push({ ...segment, text: segment.text.slice(0, match.index) });
      right.push({ ...segment, text: segment.text.slice(match.index + match[0].length) });
      target = right;
    } else {
      target.push(segment);
    }
  }

  return [left, right];
}

function isSectionHeading(text: string, segments: Segment[]): boolean {
  return (
    text.length > 0 &&
    text.length < 48 &&
    /[A-Z]/.test(text) &&
    text === text.toUpperCase() &&
    segments.filter((s) => s.text.trim()).every((s) => s.bold)
  );
}

function lineLevel(segments: Segment[]): ResumeLine["level"] {
  const first = segments.find((segment) => segment.text.trim());

  if (!first?.bold) return "text";

  return first.size >= 11 ? "org" : "role";
}

function toExperience(section: ResumeSection | undefined): ResumeExperience[] {
  const experience: ResumeExperience[] = [];

  for (const block of section?.blocks ?? []) {
    const current = experience.at(-1);

    if (block.kind === "line" && block.level === "org") {
      experience.push({ org: toPlain(block.left), location: block.right, roles: [] });
    } else if (block.kind === "line" && block.level === "role" && current) {
      current.roles.push({ title: toPlain(block.left), dates: block.right, highlights: [] });
    } else if (block.kind === "list" && current?.roles.length) {
      current.roles.at(-1)!.highlights.push(...block.items.map(toPlain));
    }
  }

  return experience;
}

function toPlain(html: string): string {
  return parse(`<p>${html}</p>`).text.trim();
}

/**
 * Keep the original document (minus Google's page chrome and scripts) as a fallback.
 * Its CSS is scoped to the shadow root it is rendered into, so leaving it mostly intact is safe.
 */
function originalOf(doc: HTMLElement, css: string): Resume["original"] {
  const html = sanitizeHtml(doc.outerHTML, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "span", "hr"]),
    allowedAttributes: { "*": ["class"], a: ["href", "rel", "target"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          href: unwrapLink(attribs.href ?? ""),
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });

  return {
    html,
    css: css.replace(/@import[^;]+;/g, "").replace(/<\/?[a-z][^>]*>/gi, ""),
  };
}

export function parseResume(page: string): Resume {
  const root = parse(page);
  const contents = root.querySelector("#contents");
  const doc = contents?.querySelector(".doc-content");

  if (!contents || !doc) {
    throw new Error("Resume document has an unexpected structure (#contents/.doc-content missing)");
  }

  const css = contents.querySelector("style")?.text ?? "";
  const classes = readClassStyles(css);

  let name = "";
  const intro: string[] = [];
  const sections: ResumeSection[] = [];

  const push = (block: ResumeBlock) => {
    const section = sections.at(-1);

    if (section) {
      section.blocks.push(block);
    } else if (block.kind === "line") {
      intro.push([block.left, block.right].filter(Boolean).join(" "));
    }
  };

  for (const element of doc.childNodes) {
    if (element.nodeType !== NodeType.ELEMENT_NODE) continue;

    const node = element as HTMLElement;

    if (node.tagName === "UL" || node.tagName === "OL") {
      const items = node
        .querySelectorAll("li")
        .map((li) => segmentsToHtml(segmentsOf(li, classes)))
        .filter(Boolean);

      if (items.length) push({ kind: "list", items });

      continue;
    }

    if (node.tagName !== "P" && !/^H\d$/.test(node.tagName)) continue;

    const segments = segmentsOf(node, classes);
    const text = segmentsToText(segments);

    if (!text) continue;

    if (!name && node.classList.contains("title")) {
      name = text;
      continue;
    }

    if (isSectionHeading(text, segments)) {
      sections.push({ title: text, blocks: [] });
      continue;
    }

    const [left, right] = splitColumns(segments);
    const rightText = segmentsToText(right);
    const line: ResumeLine = {
      kind: "line",
      level: lineLevel(segments),
      left: segmentsToHtml(left),
    };

    if (!line.left) {
      // indented continuation line: no left column, only text after the gap
      line.left = segmentsToHtml(right);
    } else if (rightText) {
      line.right = rightText;
    }

    // A line with no column gap continuing a previous line (e.g. long publication credits)
    const previous = sections.at(-1)?.blocks.at(-1);

    if (
      previous?.kind === "line" &&
      line.level === "text" &&
      previous.level === "text" &&
      !node.classList.length
    ) {
      previous.left += ` ${line.left}`;
      continue;
    }

    push(line);
  }

  const experience = toExperience(sections.find((section) => /experience/i.test(section.title)));
  const structured =
    Boolean(name) &&
    sections.length >= 2 &&
    experience.length > 0 &&
    experience.every((entry) => entry.roles.length > 0);

  return {
    name,
    intro,
    sections,
    experience,
    original: originalOf(doc, css),
    structured,
  };
}
