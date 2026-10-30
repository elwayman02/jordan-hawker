import { site } from "#app/data/site.ts";

/**
 * `{{pageTitle "Works"}}` sets document.title while the page renders.
 */
export default function pageTitle(...parts: (string | undefined)[]): undefined {
  document.title = [...parts.filter(Boolean), site.name].join(" · ");
}
