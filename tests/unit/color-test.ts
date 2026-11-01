import { afterEach, describe, expect, test } from "vitest";

import { accentHex, toHex } from "#utils/color.ts";

import "#app/styles/tokens.css";
import "#app/styles/holidays.css";

describe("colors", () => {
  afterEach(() => {
    delete document.documentElement.dataset.holiday;
  });

  test("any CSS color comes out as #rrggbb", () => {
    expect(toHex("rgb(217, 83, 43)")).toBe("#d9532b");
    expect(toHex("#fff")).toBe("#ffffff");
    expect(toHex("oklch(60% 0.2 36)")).toMatch(/^#[0-9a-f]{6}$/);
    expect(toHex("not a color")).toBeUndefined();
  });

  test("the accent follows the theme", () => {
    const usual = accentHex();

    document.documentElement.dataset.holiday = "winter";

    const winter = accentHex();

    expect(usual).toMatch(/^#[0-9a-f]{6}$/);
    expect(winter).toMatch(/^#[0-9a-f]{6}$/);
    expect(winter).not.toBe(usual);
  });
});
