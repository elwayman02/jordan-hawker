const longDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const monthYear = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" });

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

export function formatDate(iso: string | Date): string {
  return longDate.format(new Date(iso));
}

export function formatMonth(iso: string | Date): string {
  return monthYear.format(new Date(iso));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

export function timeAgo(iso: string | Date, now = Date.now()): string {
  const delta = new Date(iso).getTime() - now;

  for (const [unit, size] of UNITS) {
    if (Math.abs(delta) >= size || unit === "minute") {
      return relative.format(Math.round(delta / size), unit);
    }
  }

  return "just now";
}

export function compactNumber(value: number): string {
  return compact.format(value);
}

/** ISO string for <time datetime> */
export function isoDate(iso: string | Date): string {
  return new Date(iso).toISOString();
}
