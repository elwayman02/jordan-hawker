import { describe, expect, test } from "vitest";

import {
  byNewest,
  highlightedRecommendations,
  recommendations,
} from "#app/data/recommendations.ts";
import { intoColumns } from "#components/recommendations/recommendation-wall.gts";

describe("recommendations", () => {
  test("dates are real dates, or empty when unknown", () => {
    for (const { name, company, date } of recommendations) {
      if (!date) continue;

      expect(date, `${name} (${company})`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(date)), `${name} (${company}): ${date}`).toBe(false);
    }
  });

  test("are listed newest first everywhere, with undated ones last", () => {
    for (const list of [recommendations, highlightedRecommendations]) {
      const dated = list.filter(({ date }) => date).map(({ date }) => date);
      const firstUndated = list.findIndex(({ date }) => !date);

      expect(dated).toEqual(dated.toSorted().reverse());
      if (firstUndated >= 0) expect(list.slice(firstUndated).every(({ date }) => !date)).toBe(true);
    }
  });
});

describe("byNewest", () => {
  const rec = (name: string, date: string) => ({ name, role: "", company: "", date, text: "" });

  test("sorts newest first and treats an empty date as the oldest", () => {
    const sorted = [
      rec("undated", ""),
      rec("old", "2015-10-01"),
      rec("new", "2026-01-15"),
      rec("also undated", ""),
      rec("middle", "2018-09-30"),
    ].toSorted(byNewest);

    expect(sorted.map(({ name }) => name)).toEqual([
      "new",
      "middle",
      "old",
      "undated",
      "also undated",
    ]);
  });
});

describe("intoColumns", () => {
  test("fills the first row in order, then the shortest column", () => {
    const heights: Record<string, number> = { a: 3, b: 1, c: 2, d: 1, e: 1 };

    expect(intoColumns(["a", "b", "c", "d", "e"], 3, (item) => heights[item]!)).toEqual([
      ["a"],
      ["b", "d", "e"],
      ["c"],
    ]);
  });

  test("a single column keeps the original order", () => {
    expect(intoColumns([1, 2, 3], 1, () => 1)).toEqual([[1, 2, 3]]);
  });
});
