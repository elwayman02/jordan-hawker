import { describe, expect, test } from "vitest";

import { activeWindow, HOLIDAYS, holidayWindows } from "#utils/holidays.ts";
import {
  PREVIEW_HOURS,
  resolveTheme,
  type HolidayOffer,
  type SavedChoice,
  type ThemeChoice,
} from "#utils/theme.ts";

/**
 * public/theme.js applies the theme before the app loads, so it can't import app/utils/theme.ts
 * and copies its rules instead. These tests run the script against the same situations as
 * resolveTheme, so the two can't drift apart.
 *
 * Vite won't import JS from public/, so the script is fetched as the page would load it.
 */
const script = await (await fetch("/theme.js")).text();

const DAY = 86_400_000;
const HOUR = 3_600_000;

// Winter's window is open
const IN_SEASON = new Date(2026, 11, 20, 12);
// No holiday near
const OFF_SEASON = new Date(2026, 7, 20, 12);

interface Setup {
  now: Date;
  saved?: SavedChoice;
  /** A ?holiday= preview, started this many hours before `now` */
  preview?: { name: string; hoursAgo: number };
}

/** Runs public/theme.js against `setup`, with its own storage, address and page */
function runScript({ now, saved, preview }: Setup) {
  const storage = new Map<string, string>([["holidays", JSON.stringify(holidayWindows(now))]]);

  if (saved) {
    storage.set("theme", saved.choice);
    storage.set("theme-saved-at", String(saved.at));
  }
  if (preview) {
    storage.set("holiday-preview", preview.name);
    storage.set("holiday-preview-at", String(now.getTime() - preview.hoursAgo * HOUR));
  }

  const dataset: Record<string, string> = {};
  const icon = document.createElement("link");

  icon.setAttribute("href", "/favicon.svg");

  const localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  };
  const location = { search: "" };
  const page = { documentElement: { dataset }, querySelector: () => icon };
  const clock = { now: () => now.getTime() };

  // The script's globals, swapped for these stand-ins
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- running the script is the point
  const run = new Function("localStorage", "location", "document", "Date", script) as (
    ...globals: unknown[]
  ) => void;

  run(localStorage, location, page, clock);

  return { theme: dataset.theme, holiday: dataset.holiday, icon: icon.getAttribute("href") };
}

/** What the app shows for `setup`: resolveTheme, as applyTheme puts it on the page */
function expected({ now, saved, preview }: Setup) {
  const previewed = HOLIDAYS.find(({ name }) => name === preview?.name);
  const window = activeWindow(now);
  let offer: HolidayOffer | undefined;

  if (previewed && preview!.hoursAgo < PREVIEW_HOURS) {
    offer = { holiday: previewed, from: now.getTime() - preview!.hoursAgo * HOUR, preview: true };
  } else if (window) {
    offer = { holiday: window.holiday, from: window.from, preview: false };
  }

  const choice: ThemeChoice = resolveTheme(saved, offer, now);
  const holiday = choice === "holiday" ? offer?.holiday.name : undefined;

  return {
    theme: choice === "light" || choice === "dark" ? choice : undefined,
    holiday,
    icon: holiday ? `/favicon-${holiday}.svg` : "/favicon.svg",
  };
}

const CHOICES: ThemeChoice[] = ["system", "light", "dark", "holiday"];

/** Unknown (saved before picks were dated), long ago, before the window opened, during it */
const SAVED_DAYS_AGO = [undefined, 60, 8, 6, 1];

function savedChoices(now: Date): (SavedChoice | undefined)[] {
  return [
    undefined,
    ...CHOICES.flatMap((choice) =>
      SAVED_DAYS_AGO.map((days) => ({
        choice,
        at: days === undefined ? 0 : now.getTime() - days * DAY,
      })),
    ),
  ];
}

const describeSaved = (saved: SavedChoice | undefined, now: Date) =>
  saved
    ? `${saved.choice}, saved ${saved.at ? (now.getTime() - saved.at) / DAY : "?"} days ago`
    : "nothing saved";

describe("public/theme.js matches resolveTheme", () => {
  for (const [season, now] of [
    ["in season", IN_SEASON],
    ["off season", OFF_SEASON],
  ] as const) {
    describe(season, () => {
      for (const saved of savedChoices(now)) {
        test(describeSaved(saved, now), () => {
          expect(runScript({ now, saved })).toEqual(expected({ now, saved }));
        });
      }
    });
  }

  describe("previewing a holiday", () => {
    for (const hoursAgo of [1, PREVIEW_HOURS - 1, PREVIEW_HOURS + 1]) {
      for (const saved of savedChoices(OFF_SEASON)) {
        const setup = { now: OFF_SEASON, saved, preview: { name: "halloween", hoursAgo } };

        test(`started ${hoursAgo}h ago, ${describeSaved(saved, OFF_SEASON)}`, () => {
          expect(runScript(setup)).toEqual(expected(setup));
        });
      }
    }
  });
});
