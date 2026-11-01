import { describe, expect, test } from "vitest";

import { HOLIDAYS } from "#utils/holidays.ts";
import { resolveTheme, type HolidayOffer } from "#utils/theme.ts";

const DAY = 86_400_000;
const NOW = new Date(2026, 9, 31, 12);
const daysAgo = (days: number) => NOW.getTime() - days * DAY;

// Halloween's window opened two weeks ago
const offer: HolidayOffer = { holiday: HOLIDAYS[0]!, from: daysAgo(14), preview: false };

describe("resolveTheme", () => {
  test("with no holiday on offer: the reader's pick, or the system's", () => {
    expect(resolveTheme(undefined, undefined, NOW)).toBe("system");
    expect(resolveTheme({ choice: "dark", at: daysAgo(30) }, undefined, NOW)).toBe("dark");
    expect(resolveTheme({ choice: "system", at: daysAgo(30) }, undefined, NOW)).toBe("system");
    // kept for the next holiday, following the system meanwhile
    expect(resolveTheme({ choice: "holiday", at: daysAgo(30) }, undefined, NOW)).toBe("system");
  });

  test("a holiday's theme shows by default to readers who haven't picked one", () => {
    expect(resolveTheme(undefined, offer, NOW)).toBe("holiday");
    expect(resolveTheme({ choice: "holiday", at: daysAgo(1) }, offer, NOW)).toBe("holiday");
  });

  test("a pick made during this holiday sticks", () => {
    expect(resolveTheme({ choice: "system", at: daysAgo(10) }, offer, NOW)).toBe("system");
    expect(resolveTheme({ choice: "dark", at: daysAgo(1) }, offer, NOW)).toBe("dark");
  });

  test("a pick from before this holiday gives way to it, once it's a week old", () => {
    expect(resolveTheme({ choice: "light", at: daysAgo(15) }, offer, NOW)).toBe("holiday");
    // picked before the window opened three days ago: gives way at exactly a week, not before
    expect(
      resolveTheme({ choice: "light", at: daysAgo(7) + 1 }, { ...offer, from: daysAgo(3) }, NOW),
    ).toBe("light");
    expect(
      resolveTheme({ choice: "light", at: daysAgo(7) }, { ...offer, from: daysAgo(3) }, NOW),
    ).toBe("holiday");
    expect(
      resolveTheme({ choice: "dark", at: daysAgo(5) }, { ...offer, from: daysAgo(3) }, NOW),
    ).toBe("dark");
  });

  test("a pick saved before picks were dated counts as long ago", () => {
    expect(resolveTheme({ choice: "dark", at: 0 }, offer, NOW)).toBe("holiday");
  });
});
