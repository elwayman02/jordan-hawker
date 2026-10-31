/**
 * Helpers for reading Google Docs HTML (published or exported), which puts every
 * text style in a generated class (.c0, .c1, …) instead of semantic markup.
 */
import { type HTMLElement, NodeType, type Node } from "node-html-parser";

import { unwrapLink } from "./html.ts";

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  /** in pt; 0 when unknown */
  size: number;
}

export interface Segment extends TextStyle {
  text: string;
  href?: string;
}

/** The parts of a CSS declaration block that matter here */
function parseStyle(declarations: string): Partial<TextStyle> {
  const style: Partial<TextStyle> = {};
  const weight = /font-weight:\s*(\d+)/.exec(declarations)?.[1];
  const size = /font-size:\s*([\d.]+)pt/.exec(declarations)?.[1];

  if (weight) style.bold = Number(weight) >= 600;
  if (size) style.size = Number(size);
  if (/font-style:\s*italic/.test(declarations)) style.italic = true;

  return style;
}

/** Collect the bits of each generated class's style that matter here */
export function readClassStyles(css: string): Map<string, Partial<TextStyle>> {
  const styles = new Map<string, Partial<TextStyle>>();

  for (const [, name, body] of css.matchAll(/\.(c\d+)\{([^}]*)\}/g)) {
    styles.set(name!, parseStyle(body!));
  }

  return styles;
}

/** Class styles, then inline styles (Docs' lightweight "mobilebasic" view inlines everything) */
export function styleOf(element: HTMLElement, classes: Map<string, Partial<TextStyle>>): TextStyle {
  const style: TextStyle = { bold: false, italic: false, size: 0 };

  for (const name of element.classList.values()) {
    Object.assign(style, classes.get(name));
  }

  return Object.assign(style, parseStyle(element.getAttribute("style") ?? ""));
}

export function segmentsOf(
  paragraph: HTMLElement,
  classes: Map<string, Partial<TextStyle>>,
): Segment[] {
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

export function escape(text: string): string {
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

export function segmentsToHtml(segments: Segment[]): string {
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

export function segmentsToText(segments: Segment[]): string {
  return segments
    .map((segment) => segment.text)
    .join("")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
