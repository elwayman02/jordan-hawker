import { describe, expect, test, vi } from "vitest";

import { rank, score } from "./codes.ts";

const NOW = Date.parse("2026-10-01T00:00:00Z");

vi.mock("./config.ts", async (original) => ({
  ...(await original<typeof import("./config.ts")>()),
  FEATURED_REPOS: ["featured-ancient"],
}));

function repo(name: string, stars: number, pushedAt: string, extra: Record<string, unknown> = {}) {
  return {
    name,
    description: null,
    html_url: `https://github.com/elwayman02/${name}`,
    homepage: "",
    language: "TypeScript",
    topics: [],
    stargazers_count: stars,
    forks_count: 0,
    pushed_at: pushedAt,
    created_at: "2015-01-01T00:00:00Z",
    fork: false,
    archived: false,
    disabled: false,
    private: false,
    ...extra,
  };
}

describe("score", () => {
  test("recent activity outweighs a few extra stars", () => {
    expect(score(10, "2026-09-01T00:00:00Z", NOW)).toBeGreaterThan(
      score(20, "2019-01-01T00:00:00Z", NOW),
    );
  });

  test("lots of stars keep an old project relevant", () => {
    expect(score(500, "2018-01-01T00:00:00Z", NOW)).toBeGreaterThan(
      score(3, "2026-09-01T00:00:00Z", NOW),
    );
  });
});

describe("rank", () => {
  const codes = rank(
    [
      repo("old-and-quiet", 2, "2017-05-01T00:00:00Z"),
      repo("popular-classic", 80, "2019-01-01T00:00:00Z"),
      repo("popular-ancient", 300, "2018-09-01T00:00:00Z"),
      repo("featured-ancient", 3, "2015-01-01T00:00:00Z"),
      repo("fresh", 5, "2026-09-20T00:00:00Z"),
      repo("forked", 900, "2026-09-20T00:00:00Z", { fork: true }),
      repo("archived", 900, "2026-09-20T00:00:00Z", { archived: true }),
      repo("jordan-hawker", 50, "2026-09-20T00:00:00Z"),
      repo("older-quiet", 1, "2019-05-01T00:00:00Z"),
    ],
    NOW,
  );

  test("excludes forks, archived and hidden repos", () => {
    const names = [...codes.active, ...codes.archive].map((r) => r.name);

    expect(names).not.toContain("forked");
    expect(names).not.toContain("archived");
    expect(names).not.toContain("jordan-hawker");
  });

  test("keeps recent or well-starred repos active, featured first, then by score", () => {
    expect(codes.active.map((r) => r.name)).toEqual([
      "featured-ancient",
      "fresh",
      "popular-classic",
    ]);
  });

  test("archives anything untouched for 8+ years, however popular", () => {
    expect(codes.archive.map((r) => r.name)).toContain("popular-ancient");
  });

  test("puts the rest in the archive, newest first", () => {
    expect(codes.archive.map((r) => r.name)).toEqual([
      "older-quiet",
      "popular-ancient",
      "old-and-quiet",
    ]);
  });
});
