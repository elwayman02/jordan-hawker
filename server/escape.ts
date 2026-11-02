/**
 * Escapes text for HTML content and double-quoted attribute values.
 *
 * Kept free of dependencies: the page-meta edge function uses it too (via meta.ts).
 */
export function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
