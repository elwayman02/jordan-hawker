import { describe, expect, test } from "vitest";

import { rank, score } from "./codes.ts";

const NOW = Date.parse("2026-10-01T00:00:00Z");

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
      repo("popular-classic", 80, "2016-01-01T00:00:00Z"),
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

  test("keeps recent or well-starred repos active, ranked by score", () => {
    expect(codes.active.map((r) => r.name)).toEqual(["fresh", "popular-classic"]);
  });

  test("puts the rest in the archive, newest first", () => {
    expect(codes.archive.map((r) => r.name)).toEqual(["older-quiet", "old-and-quiet"]);
  });
});
