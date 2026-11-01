import type { IconName } from "#app/icons.ts";

export interface Holiday {
  /** Used as <html data-holiday>, ?holiday={name}, and public/favicon-{name}.svg */
  name: string;
  label: string;
  /** Shown on the theme toggle while this holiday's theme is on */
  icon: IconName;
  /** The holiday itself in a given year, at local midnight */
  date: (year: number) => Date;
  /** Days before the holiday its theme is offered (default: DAYS_BEFORE) */
  before?: number;
  /** Days after the holiday its theme is still offered (default: DAYS_AFTER) */
  after?: number;
}

/** Easter Sunday (Gregorian), by the anonymous "Meeus/Jones/Butcher" algorithm */
export function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;

  return new Date(year, Math.floor(n / 31) - 1, (n % 31) + 1);
}

/** In calendar order. Seasonal themes are timed to a holiday but don't celebrate it. */
export const HOLIDAYS: Holiday[] = [
  {
    name: "newyear",
    label: "New Year’s",
    icon: "partyPopper",
    date: (year) => new Date(year, 0, 1),
  },
  {
    name: "valentine",
    label: "Valentine’s Day",
    icon: "heart",
    date: (year) => new Date(year, 1, 14),
  },
  {
    name: "birthday",
    label: "Jordan’s birthday",
    icon: "cake",
    date: (year) => new Date(year, 1, 25),
    // a shorter run, leaving Valentine's Day its full lead-up
    before: 7,
    after: 7,
  },
  {
    // A day, not a season: a week's lead-up and one day after
    name: "pi",
    label: "Pi Day",
    icon: "pi",
    date: (year) => new Date(year, 2, 14),
    before: 7,
    after: 1,
  },
  {
    // Blossoms rather than Easter, but timed to it
    name: "spring",
    label: "Spring",
    icon: "flower",
    date: easter,
  },
  {
    // All of June
    name: "pride",
    label: "Pride Month",
    icon: "rainbow",
    date: (year) => new Date(year, 5, 1),
    before: 0,
    after: 29,
  },
  {
    // Sunny rather than patriotic, but timed to the Fourth of July: July 1st (after Pride)
    // through most of the month
    name: "summer",
    label: "Summer",
    icon: "treePalm",
    date: (year) => new Date(year, 6, 4),
    before: 3,
    after: 21,
  },
  {
    name: "halloween",
    label: "Halloween",
    icon: "ghost",
    date: (year) => new Date(year, 9, 31),
  },
  {
    // US Thanksgiving: the fourth Thursday of November
    name: "thanksgiving",
    label: "Thanksgiving",
    icon: "leaf",
    date: (year) => {
      const firstThursday = 1 + ((4 - new Date(year, 10, 1).getDay() + 7) % 7);

      return new Date(year, 10, firstThursday + 21);
    },
  },
  {
    // Snowy rather than strictly Christmas, but timed to it
    name: "winter",
    label: "Winter",
    icon: "snowflake",
    date: (year) => new Date(year, 11, 25),
  },
];

/** By default, a holiday's theme is offered from two weeks before it… */
export const DAYS_BEFORE = 14;
/** …through one week after it. */
export const DAYS_AFTER = 7;
/** Where windows overlap, a holiday that has passed keeps this many days after it, at least */
export const DAYS_KEPT_IN_OVERLAP = 1;

export interface HolidayWindow {
  name: string;
  /** Start of the first day the theme is offered (ms) */
  from: number;
  /** Start of the first day it's no longer offered (ms) */
  until: number;
}

const startOfDay = (date: Date, plusDays = 0) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + plusDays).getTime();

/**
 * Every window for the years around `now`, in order. Where two overlap (New Year's just after
 * Christmas, say), the earlier holiday keeps its day and one more, then the upcoming one takes
 * over: from then on, or from the start of its own window if that's later.
 */
function allWindows(now: Date): HolidayWindow[] {
  const year = now.getFullYear();
  const windows = HOLIDAYS.flatMap((holiday) =>
    [year - 1, year, year + 1].map((y) => {
      const date = holiday.date(y);

      return {
        name: holiday.name,
        date,
        from: startOfDay(date, -(holiday.before ?? DAYS_BEFORE)),
        until: startOfDay(date, (holiday.after ?? DAYS_AFTER) + 1),
      };
    }),
  ).toSorted((a, b) => a.date.getTime() - b.date.getTime());

  windows.forEach((window, index) => {
    const next = windows[index + 1];

    if (next && window.until > next.from) {
      const handover = Math.max(next.from, startOfDay(window.date, DAYS_KEPT_IN_OVERLAP + 1));

      window.until = handover;
      next.from = handover;
    }
  });

  return windows.map(({ name, from, until }) => ({ name, from, until }));
}

/** The current and upcoming windows, soonest first */
export function holidayWindows(now = new Date()): HolidayWindow[] {
  return allWindows(now).filter((window) => window.until > now.getTime());
}

/** Today's holiday window, if any, with its holiday */
export function activeWindow(now = new Date()): (HolidayWindow & { holiday: Holiday }) | undefined {
  const time = now.getTime();
  const window = allWindows(now).find(({ from, until }) => from <= time && time < until);
  const holiday = HOLIDAYS.find(({ name }) => name === window?.name);

  return window && holiday ? { ...window, holiday } : undefined;
}

/** The holiday whose theme is on offer today, if any */
export function activeHoliday(now = new Date()): Holiday | undefined {
  return activeWindow(now)?.holiday;
}
