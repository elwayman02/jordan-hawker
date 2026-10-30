import { parse } from "node-html-parser";
import sanitizeHtml from "sanitize-html";

/**
 * Google Docs (and others) wrap outbound links in a redirect:
 *   https://www.google.com/url?q=<real url>&sa=D...
 */
export function unwrapLink(href: string): string {
  try {
    const url = new URL(href);

    if (url.hostname.endsWith("google.com") && url.pathname === "/url") {
      return url.searchParams.get("q") ?? href;
    }
  } catch {
    // relative or malformed: leave as-is
  }

  return href;
}

const linkAttributes = (tagName: string, attribs: sanitizeHtml.Attributes) => ({
  tagName,
  attribs: {
    ...attribs,
    href: unwrapLink(attribs.href ?? ""),
    rel: "noopener noreferrer",
    target: "_blank",
  },
});

/** Article-level HTML: blog posts and similar long-form content */
export function sanitizeArticle(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags.filter((tag) => tag !== "h1"),
      "img",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      code: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: linkAttributes,
      h1: "h2",
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "p" && !frame.text.trim() && !frame.mediaChildren.length,
  });
}

/** Strip all markup (keeping word breaks between blocks), decode entities, collapse whitespace */
export function toText(html: string): string {
  const spaced = html.replace(/<\/(p|h\d|li|div|blockquote|figcaption)>|<br\s*\/?>/gi, "$& ");

  return parse(sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} }))
    .text.replace(/\s+/g, " ")
    .trim();
}

export function excerpt(html: string, length = 220): string {
  const text = toText(html);

  if (text.length <= length) return text;

  return `${text.slice(0, text.lastIndexOf(" ", length))}…`;
}
