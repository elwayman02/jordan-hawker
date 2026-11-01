import { describe, expect, test } from "vitest";

import { activeHoliday, easter, HOLIDAYS, holidayWindows } from "#utils/holidays.ts";

const on = (year: number, month: number, day: number, hour = 12) =>
  new Date(year, month - 1, day, hour);

/** The holiday on offer from `first` through `last` (inclusive), and on neither side */
function expectWindow(name: string, first: Date, last: Date) {
  const before = new Date(first.getFullYear(), first.getMonth(), first.getDate() - 1, 23);
  const after = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1, 0);

  expect(activeHoliday(before)?.name, `day before ${name}`).not.toBe(name);
  expect(activeHoliday(first)?.name, `first day of ${name}`).toBe(name);
  expect(activeHoliday(new Date(last.getTime() + 23 * 3600_000))?.name, `last day of ${name}`).toBe(
    name,
  );
  expect(activeHoliday(after)?.name, `day after ${name}`).not.toBe(name);
}

describe("holidays", () => {
  test("each theme is offered from two weeks before its holiday through one week after", () => {
    expectWindow("halloween", on(2026, 10, 17, 0), on(2026, 11, 7, 0));
    expectWindow("thanksgiving", on(2026, 11, 12, 0), on(2026, 12, 3, 0));
    expectWindow("spring", on(2026, 3, 22, 0), on(2026, 4, 12, 0));
  });

  test("nothing is offered far from a holiday", () => {
    expect(activeHoliday(on(2026, 8, 20))).toBeUndefined();
    expect(activeHoliday(on(2026, 11, 10))).toBeUndefined();
  });

  test("Thanksgiving is the fourth Thursday of November", () => {
    const thanksgiving = HOLIDAYS.find(({ name }) => name === "thanksgiving")!;

    expect(thanksgiving.date(2025)).toEqual(on(2025, 11, 27, 0));
    expect(thanksgiving.date(2026)).toEqual(on(2026, 11, 26, 0));
    expect(thanksgiving.date(2027)).toEqual(on(2027, 11, 25, 0));
    expect(thanksgiving.date(2029)).toEqual(on(2029, 11, 22, 0));
  });

  test("Spring follows Easter", () => {
    expect(easter(2008)).toEqual(on(2008, 3, 23, 0)); // about as early as it gets
    expect(easter(2024)).toEqual(on(2024, 3, 31, 0));
    expect(easter(2025)).toEqual(on(2025, 4, 20, 0));
    expect(easter(2026)).toEqual(on(2026, 4, 5, 0));
    expect(easter(2027)).toEqual(on(2027, 3, 28, 0));
    expect(easter(2038)).toEqual(on(2038, 4, 25, 0)); // as late as it gets
  });

  test("where windows overlap, a past holiday keeps one more day, then the next takes over", () => {
    // New Year's lead-up starts Dec 18, but Christmas keeps the 25th and 26th
    expectWindow("winter", on(2026, 12, 11, 0), on(2026, 12, 26, 0));
    expectWindow("newyear", on(2026, 12, 27, 0), on(2027, 1, 8, 0));
  });

  test("Pi Day runs a week before and a day after; Pride all of June; Summer from July 1st", () => {
    expectWindow("pi", on(2027, 3, 7, 0), on(2027, 3, 15, 0));
    expectWindow("pride", on(2027, 6, 1, 0), on(2027, 6, 30, 0));
    expectWindow("summer", on(2027, 7, 1, 0), on(2027, 7, 25, 0));
  });

  test("an early Easter waits for Pi Day to finish", () => {
    // Easter 2027 is Mar 28, so Spring would start Mar 14: Pi Day itself
    expectWindow("spring", on(2027, 3, 16, 0), on(2027, 4, 4, 0));
  });

  test("the birthday has a shorter, one-week run each side", () => {
    // Valentine's Day carries on until the birthday's own window opens
    expectWindow("valentine", on(2027, 1, 31, 0), on(2027, 2, 17, 0));
    expectWindow("birthday", on(2027, 2, 18, 0), on(2027, 3, 4, 0));
  });

  test("windows never overlap, whatever the year", () => {
    for (let year = 2026; year < 2060; year++) {
      const windows = holidayWindows(on(year, 1, 2, 0)).filter(
        ({ from }) => new Date(from).getFullYear() === year,
      );

      for (const [a, b] of windows.slice(1).map((w, i) => [windows[i]!, w] as const)) {
        expect(a.until, `${year}: ${a.name} / ${b.name}`).toBeLessThanOrEqual(b.from);
      }
    }
  });

  test("every holiday has its own theme on its day", () => {
    for (const holiday of HOLIDAYS) {
      expect(activeHoliday(holiday.date(2027))?.name).toBe(holiday.name);
    }
  });

  test("lists the current and upcoming windows, soonest first", () => {
    const windows = holidayWindows(on(2026, 10, 31));

    expect(windows.map(({ name }) => name).slice(0, 12)).toEqual([
      "halloween",
      "thanksgiving",
      "winter",
      "newyear",
      "valentine",
      "birthday",
      "pi",
      "spring",
      "pride",
      "summer",
      "halloween",
      "thanksgiving",
    ]);
    expect(windows[0]).toEqual({
      name: "halloween",
      from: on(2026, 10, 17, 0).getTime(),
      until: on(2026, 11, 8, 0).getTime(),
    });
  });
});
