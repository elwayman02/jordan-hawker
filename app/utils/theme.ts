import { activeWindow, HOLIDAYS, holidayWindows, type Holiday } from "#utils/holidays.ts";

/**
 * "holiday" means: the current holiday's theme whenever one is on offer, else the system's.
 * It stays saved between holidays, so it comes back on its own for the next one.
 */
export type ThemeChoice = "system" | "light" | "dark" | "holiday";

/** A theme the reader picked on the toggle, and when */
export interface SavedChoice {
  choice: ThemeChoice;
  /** ms; 0 when unknown (saved before this was recorded) */
  at: number;
}

/** A holiday whose theme is on offer, and since when */
export interface HolidayOffer {
  holiday: Holiday;
  /** Start of its window (ms); for a preview, when it started */
  from: number;
  preview: boolean;
}

const KEY = "theme";
const SAVED_AT_KEY = "theme-saved-at";
/** Upcoming holiday windows, for public/theme.js to apply a holiday theme before first paint */
const WINDOWS_KEY = "holidays";
/**
 * Set by public/theme.js from ?holiday=name, with when it started. Ended by the footer's
 * "Stop preview", or on its own after PREVIEW_HOURS.
 */
const PREVIEW_KEY = "holiday-preview";
const PREVIEW_AT_KEY = "holiday-preview-at";
export const PREVIEW_HOURS = 24;
const HOUR = 3_600_000;

/**
 * A theme saved before a holiday came around gives way to that holiday's theme by default,
 * once it's at least this old. (Picking again during the holiday sticks.)
 */
export const OVERRIDE_AFTER_DAYS = 7;
const DAY = 86_400_000;

/**
 * Where "now" comes from: the real time, except in tests, which set it to try out holidays
 * (rather than faking the page-wide Date, which the test runner shares).
 */
export const clock = { now: () => new Date() };

/** A holiday being previewed out of season, if any, and when the preview started */
function readPreview(now: Date): { holiday: Holiday; at: number } | undefined {
  try {
    const name = localStorage.getItem(PREVIEW_KEY);

    if (!name) return undefined;

    const holiday = HOLIDAYS.find((holiday) => holiday.name === name);
    const at = Number(localStorage.getItem(PREVIEW_AT_KEY)) || 0;

    if (holiday && now.getTime() - at < PREVIEW_HOURS * HOUR) return { holiday, at };

    // unknown (a typo) or run its course: forget it, so public/theme.js stops applying it
    forgetPreview();

    return undefined;
  } catch {
    return undefined;
  }
}

function forgetPreview() {
  try {
    localStorage.removeItem(PREVIEW_KEY);
    localStorage.removeItem(PREVIEW_AT_KEY);
  } catch {
    // storage unavailable: there was no saved preview to forget
  }
}

/** A holiday being previewed out of season, if any */
export function previewHoliday(now = clock.now()): Holiday | undefined {
  return readPreview(now)?.holiday;
}

/** Reloads the page; tests swap it out */
export const page = { reload: () => location.reload() };

/**
 * Ends a ?holiday= preview: forgets it, takes the parameter out of the address (or a reload
 * would start it again), and reloads, so the theme and its animation settle as normal.
 */
export function stopPreview() {
  forgetPreview();

  const url = new URL(location.href);

  url.searchParams.delete("holiday");
  history.replaceState(history.state, "", url);
  page.reload();
}

/** The holiday whose theme is on offer: one being previewed, or else today's */
export function holidayOffer(now = clock.now()): HolidayOffer | undefined {
  const preview = readPreview(now);

  if (preview) return { holiday: preview.holiday, from: preview.at, preview: true };

  const window = activeWindow(now);

  return window && { holiday: window.holiday, from: window.from, preview: false };
}

export function readSaved(): SavedChoice | undefined {
  try {
    const choice = localStorage.getItem(KEY);

    if (choice !== "system" && choice !== "light" && choice !== "dark" && choice !== "holiday") {
      return undefined;
    }

    return { choice, at: Number(localStorage.getItem(SAVED_AT_KEY)) || 0 };
  } catch {
    return undefined;
  }
}

/** Saves a pick from the toggle, "system" included, so it can be told apart from no pick */
export function saveChoice(choice: ThemeChoice, now = clock.now()) {
  try {
    localStorage.setItem(KEY, choice);
    localStorage.setItem(SAVED_AT_KEY, String(now.getTime()));
  } catch {
    // storage unavailable (private mode): the choice lasts for this page view
  }
}

/**
 * The theme to show. While a holiday is on offer, its theme shows unless the reader picked
 * something else: during this holiday, or within the last week. Otherwise, their pick, or
 * the system's. public/theme.js mirrors this before first paint.
 */
export function resolveTheme(
  saved: SavedChoice | undefined,
  offer: HolidayOffer | undefined,
  now = clock.now(),
): ThemeChoice {
  if (!offer) return !saved || saved.choice === "holiday" ? "system" : saved.choice;
  if (!saved || saved.choice === "holiday") return "holiday";

  const pickedBeforeThisHoliday = saved.at < offer.from;
  const pickedLongAgo = now.getTime() - saved.at >= OVERRIDE_AFTER_DAYS * DAY;

  return pickedBeforeThisHoliday && pickedLongAgo ? "holiday" : saved.choice;
}

/** Keeps public/theme.js's copy of the holiday calendar current */
export function rememberHolidayWindows(now = clock.now()) {
  try {
    localStorage.setItem(WINDOWS_KEY, JSON.stringify(holidayWindows(now)));
  } catch {
    // storage unavailable: nothing to apply early anyway
  }
}

/**
 * Applies a theme as <html data-theme> / <html data-holiday>, plus that holiday's favicon.
 * public/theme.js does the same before first paint.
 */
export function applyTheme(choice: ThemeChoice, holiday: Holiday | undefined) {
  const root = document.documentElement;
  const festive = choice === "holiday" ? holiday : undefined;

  if (choice === "light" || choice === "dark") root.dataset.theme = choice;
  else delete root.dataset.theme;

  if (festive) root.dataset.holiday = festive.name;
  else delete root.dataset.holiday;

  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

  if (icon) icon.href = festive ? `/favicon-${festive.name}.svg` : "/favicon.svg";
}
