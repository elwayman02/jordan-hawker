import { parse, type HTMLElement, NodeType, type Node } from "node-html-parser";
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
import { unwrapLink } from "./html.ts";

export async function getResume(): Promise<Resume> {
  return parseResume(await fetchText(RESUME_DOC_URL));
}

interface TextStyle {
  bold: boolean;
  italic: boolean;
  /** in pt; 0 when unknown */
  size: number;
}

interface Segment extends TextStyle {
  text: string;
  href?: string;
}

/**
 * Google Docs "publish to web" pages put each style in a generated class (.c0, .c1, …).
 * Collect the bits we care about per class.
 */
function readClassStyles(css: string): Map<string, Partial<TextStyle>> {
  const styles = new Map<string, Partial<TextStyle>>();

  for (const [, name, body] of css.matchAll(/\.(c\d+)\{([^}]*)\}/g)) {
    const style: Partial<TextStyle> = {};
    const weight = /font-weight:(\d+)/.exec(body!)?.[1];
    const size = /font-size:([\d.]+)pt/.exec(body!)?.[1];

    if (weight) style.bold = Number(weight) >= 600;
    if (size) style.size = Number(size);
    if (/font-style:italic/.test(body!)) style.italic = true;

    styles.set(name!, style);
  }

  return styles;
}

function styleOf(element: HTMLElement, classes: Map<string, Partial<TextStyle>>): TextStyle {
  const style: TextStyle = { bold: false, italic: false, size: 0 };

  for (const name of element.classList.values()) {
    Object.assign(style, classes.get(name));
  }

  return style;
}

/** Runs of 2+ non-breaking spaces (or tabs) separate "left" from "right" columns */
const COLUMN_GAP = /[\u00a0\t]{2,}|\t/;

function segmentsOf(paragraph: HTMLElement, classes: Map<string, Partial<TextStyle>>): Segment[] {
  const segments: Segment[] = [];

  const visit = (node: Node, inherited: TextStyle, href?: string) => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      const text = node.text;

      if (text) segments.push({ ...inherited, text, href });

      return;
    }

    const element = node as HTMLElement;
    const style = element.tagName === "SPAN" ? styleOf(element, classes) : inherited;
    const link =
      element.tagName === "A" ? unwrapLink(element.getAttribute("href") ?? "") || href : href;

    for (const child of element.childNodes) visit(child, style, link);
  };

  for (const child of paragraph.childNodes) {
    visit(child, { bold: false, italic: false, size: 0 });
  }

  return segments;
}

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Merge neighbouring segments that render identically (Docs splits runs arbitrarily) */
function coalesce(segments: Segment[]): Segment[] {
  const merged: Segment[] = [];

  for (const segment of segments) {
    const previous = merged.at(-1);

    if (
      previous &&
      previous.bold === segment.bold &&
      previous.italic === segment.italic &&
      previous.href === segment.href
    ) {
      previous.text += segment.text;
    } else {
      merged.push({ ...segment });
    }
  }

  return merged;
}

function segmentsToHtml(segments: Segment[]): string {
  return coalesce(segments)
    .map((segment) => {
      let html = escape(segment.text.replace(/\u00a0/g, " "));

      if (!html) return "";
      if (segment.bold && html.trim()) html = `<strong>${html}</strong>`;
      if (segment.italic && html.trim()) html = `<em>${html}</em>`;
      if (segment.href) {
        html = `<a href="${escape(segment.href)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
      }

      return html;
    })
    .join("")
    .replace(/<\/strong><strong>/g, "")
    .trim();
}

function segmentsToText(segments: Segment[]): string {
  return segments
    .map((segment) => segment.text)
    .join("")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
