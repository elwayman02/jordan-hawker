/**
 * The kinds of election a voter guide can be for, and the guide's address under /votes.
 * A general election's guide lives at just the year (/votes/2024); any other kind adds
 * itself (/votes/2024/primary).
 *
 * Shared by /api/votes (server/votes.ts) and link previews (server/meta.ts), which reads
 * the election back from the address alone. Kept free of dependencies for the edge function.
 */

/** Anything that isn't one of these is a general election */
export const OTHER_KINDS = ["Primary", "Special", "Recall"] as const;

export type ElectionKind = "General" | (typeof OTHER_KINDS)[number];

/** "2024" for a general election, "2024/primary" otherwise */
export function electionSlug(year: string, kind: ElectionKind): string {
  return kind === "General" ? year : `${year}/${kind.toLowerCase()}`;
}

/** The election a guide's address names ("2024", "2024/primary"), if it names one */
export function readElectionSlug(slug: string): { year: string; kind: ElectionKind } | undefined {
  const [year, kind, ...rest] = slug.split("/");

  if (!year || !/^(?:19|20)\d{2}$/.test(year) || rest.length) return undefined;
  if (kind === undefined) return { year, kind: "General" };

  const other = OTHER_KINDS.find((name) => name.toLowerCase() === kind.toLowerCase());

  return other && { year, kind: other };
}
