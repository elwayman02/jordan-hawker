import { click, render } from "@ember/test-helpers";
import { afterEach, beforeEach, describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import HolidayFall from "#components/holidays/holiday-fall.gts";
import HolidayPreview from "#components/holidays/holiday-preview.gts";
import ThemeToggle from "#components/theme-toggle.gts";
import { clock, page } from "#utils/theme.ts";

const HALLOWEEN = new Date(2026, 9, 31, 12);
// no holiday near
const OFF_SEASON = new Date(2026, 7, 20, 12);
const DAY = 86_400_000;

const root = document.documentElement;
const toggle = () => document.querySelector<HTMLButtonElement>(".theme-toggle")!;

/** Sets the date the theme code sees */
function travelTo(now: Date) {
  clock.now = () => new Date(now);
}

/** As if the reader picked `choice` on the toggle, `daysAgo` days ago */
function picked(choice: string, daysAgo = 0) {
  localStorage.setItem("theme", choice);
  localStorage.setItem("theme-saved-at", String(clock.now().getTime() - daysAgo * DAY));
}

/** As public/theme.js saves a ?holiday=name preview, started `hoursAgo` hours ago */
function previewing(name: string, hoursAgo = 0) {
  localStorage.setItem("holiday-preview", name);
  localStorage.setItem("holiday-preview-at", String(clock.now().getTime() - hoursAgo * 3_600_000));
}

function cleanUp() {
  clock.now = () => new Date();
  for (const key of [
    "theme",
    "theme-saved-at",
    "holidays",
    "holiday-preview",
    "holiday-preview-at",
  ]) {
    localStorage.removeItem(key);
  }
  delete root.dataset.theme;
  delete root.dataset.holiday;
}

describe("holiday themes", () => {
  beforeEach(cleanUp);
  afterEach(cleanUp);

  renderingTest("a holiday's theme shows by default, and the toggle cycles past it", async () => {
    travelTo(HALLOWEEN);
    await render(<template><ThemeToggle /></template>);

    expect(root.dataset.holiday).toBe("halloween");

    const seen = [toggle().dataset.themeChoice];

    for (let i = 0; i < 4; i++) {
      await click(".theme-toggle");
      seen.push(toggle().dataset.themeChoice);
    }

    expect(seen).toEqual(["holiday", "system", "light", "dark", "holiday"]);
  });

  renderingTest("every pick is saved, system included, with when", async () => {
    travelTo(HALLOWEEN);
    await render(<template><ThemeToggle /></template>);

    await click(".theme-toggle");

    expect(toggle().dataset.themeChoice).toBe("system");
    expect(root.dataset.holiday).toBeUndefined();
    expect(localStorage.getItem("theme")).toBe("system");
    expect(localStorage.getItem("theme-saved-at")).toBe(String(HALLOWEEN.getTime()));
  });

  renderingTest("a pick made during the holiday sticks", async () => {
    travelTo(HALLOWEEN);
    picked("dark", 10); // Halloween's window opened two weeks ago
    await render(<template><ThemeToggle /></template>);

    expect(toggle().dataset.themeChoice).toBe("dark");
    expect(root.dataset.theme).toBe("dark");
    expect(root.dataset.holiday).toBeUndefined();
  });

  renderingTest("a week-old pick from before the holiday gives way to it", async () => {
    travelTo(HALLOWEEN);
    picked("light", 20);
    await render(<template><ThemeToggle /></template>);

    expect(toggle().dataset.themeChoice).toBe("holiday");
    expect(root.dataset.holiday).toBe("halloween");
    // only a default: the old pick is still what's saved
    expect(localStorage.getItem("theme")).toBe("light");
  });

  renderingTest("the holiday theme sets its colors, icon and favicon", async () => {
    travelTo(HALLOWEEN);
    picked("dark");
    await render(<template><ThemeToggle /></template>);

    await click(".theme-toggle");

    expect(root.dataset.holiday).toBe("halloween");
    expect(root.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("theme")).toBe("holiday");
    expect(toggle().title).toBe("Color theme: Halloween. Switch to system.");
  });

  renderingTest("each holiday brings its own theme and toggle icon", async () => {
    const seasons = [
      { now: new Date(2026, 10, 20, 12), name: "thanksgiving", label: "Thanksgiving" },
      { now: new Date(2026, 11, 20, 12), name: "winter", label: "Winter" },
    ];

    for (const { now, name, label } of seasons) {
      travelTo(now);
      await render(<template><ThemeToggle /></template>);

      expect(root.dataset.holiday).toBe(name);
      expect(toggle().title).toBe(`Color theme: ${label}. Switch to system.`);

      cleanUp();
    }
  });

  renderingTest("between holidays, a saved holiday choice follows the system", async () => {
    travelTo(OFF_SEASON);
    picked("holiday", 30);
    root.dataset.holiday = "halloween";
    await render(<template><ThemeToggle /></template>);

    expect(toggle().dataset.themeChoice).toBe("system");
    expect(root.dataset.holiday).toBeUndefined();
    // kept, so the next holiday's theme comes back on its own
    expect(localStorage.getItem("theme")).toBe("holiday");

    await click(".theme-toggle");
    await click(".theme-toggle");
    await click(".theme-toggle");

    expect(toggle().dataset.themeChoice).toBe("system");
  });

  renderingTest("keeps public/theme.js's holiday calendar current", async () => {
    travelTo(HALLOWEEN);
    await render(<template><ThemeToggle /></template>);

    const windows = JSON.parse(localStorage.getItem("holidays")!) as { name: string }[];

    expect(windows[0]?.name).toBe("halloween");
  });

  renderingTest("pieces fall on load by default during a holiday", async ({ element }) => {
    travelTo(HALLOWEEN);
    await render(<template><HolidayFall /></template>);

    expect(element.querySelector(".holiday-fall")?.getAttribute("aria-hidden")).toBe("true");
    expect(element.querySelectorAll(".holiday-fall__piece svg").length).toBeGreaterThan(0);
  });

  renderingTest(
    "picking the holiday theme plays its flurry; leaving it stops",
    async ({ element }) => {
      travelTo(HALLOWEEN);
      picked("system", 2);
      await render(
        <template>
          <ThemeToggle />
          <HolidayFall />
        </template>,
      );

      expect(element.querySelector(".holiday-fall")).toBeNull();

      // system → light → dark → holiday
      await click(".theme-toggle");
      await click(".theme-toggle");

      expect(element.querySelector(".holiday-fall")).toBeNull();

      await click(".theme-toggle");

      expect(toggle().dataset.themeChoice).toBe("holiday");
      expect(element.querySelectorAll(".holiday-fall__piece svg").length).toBeGreaterThan(0);

      await click(".theme-toggle");

      expect(element.querySelector(".holiday-fall")).toBeNull();
    },
  );

  renderingTest("nothing falls for readers who picked another theme", async ({ element }) => {
    travelTo(HALLOWEEN);
    picked("system", 2);
    await render(<template><HolidayFall /></template>);

    expect(element.querySelector(".holiday-fall")).toBeNull();
  });

  renderingTest("nothing falls between holidays", async ({ element }) => {
    travelTo(OFF_SEASON);
    picked("holiday", 30);
    await render(<template><HolidayFall /></template>);

    expect(element.querySelector(".holiday-fall")).toBeNull();
  });

  describe("previewing out of season (?holiday=name, saved by public/theme.js)", () => {
    renderingTest("offers that holiday's theme, labelled as a preview", async () => {
      travelTo(OFF_SEASON);
      previewing("winter");
      await render(<template><ThemeToggle /></template>);

      expect(root.dataset.holiday).toBe("winter");
      expect(toggle().title).toBe("Color theme: Winter (preview). Switch to system.");
    });

    renderingTest("respects a recent pick, like a real holiday would", async () => {
      travelTo(OFF_SEASON);
      previewing("winter");
      picked("dark", 1);
      await render(<template><ThemeToggle /></template>);

      expect(toggle().dataset.themeChoice).toBe("dark");

      await click(".theme-toggle");

      expect(root.dataset.holiday).toBe("winter");
    });

    renderingTest("takes the place of today's holiday", async () => {
      travelTo(HALLOWEEN);
      previewing("thanksgiving");
      await render(<template><ThemeToggle /></template>);

      expect(root.dataset.holiday).toBe("thanksgiving");
    });

    renderingTest("plays that holiday's animation on load", async ({ element }) => {
      travelTo(OFF_SEASON);
      previewing("winter");
      await render(<template><HolidayFall /></template>);

      expect(element.querySelectorAll(".holiday-fall__piece svg").length).toBeGreaterThan(0);
    });

    renderingTest("the footer says a preview is on, with a way to stop it", async ({ element }) => {
      previewing("winter");
      history.replaceState(history.state, "", "?holiday=winter");

      let reloaded = false;
      const reload = page.reload;

      page.reload = () => (reloaded = true);

      try {
        await render(<template><HolidayPreview /></template>);

        expect(
          element.querySelector(".holiday-preview")?.textContent?.replace(/\s+/g, " ").trim(),
        ).toBe("Previewing the Winter theme · Stop preview");

        await click(".holiday-preview__stop");

        expect(localStorage.getItem("holiday-preview")).toBeNull();
        expect(new URL(location.href).searchParams.has("holiday")).toBe(false);
        expect(reloaded).toBe(true);
      } finally {
        page.reload = reload;
      }
    });

    renderingTest("the footer says nothing when nothing's being previewed", async ({ element }) => {
      await render(<template><HolidayPreview /></template>);

      expect(element.querySelector(".holiday-preview")).toBeNull();
    });

    renderingTest("ends on its own after 24 hours", async () => {
      travelTo(OFF_SEASON);
      previewing("winter", 23);
      await render(<template><ThemeToggle /></template>);

      expect(root.dataset.holiday).toBe("winter");

      cleanUp();
      travelTo(OFF_SEASON);
      previewing("winter", 24);
      await render(<template><ThemeToggle /></template>);

      expect(root.dataset.holiday).toBeUndefined();
      expect(localStorage.getItem("holiday-preview")).toBeNull();
      expect(localStorage.getItem("holiday-preview-at")).toBeNull();
    });

    renderingTest("ignores holidays it doesn't know", async () => {
      travelTo(OFF_SEASON);
      previewing("festivus");
      await render(<template><ThemeToggle /></template>);

      expect(toggle().dataset.themeChoice).toBe("system");
      expect(root.dataset.holiday).toBeUndefined();
      expect(localStorage.getItem("holiday-preview")).toBeNull();
    });
  });
});
