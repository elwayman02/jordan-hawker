// Applies the color theme before first paint. Mirrors resolveTheme in app/utils/theme.ts.
try {
  const root = document.documentElement;
  const now = Date.now();

  // The holiday calendar the app keeps current (every holiday appears in a year's worth)
  const windows = JSON.parse(localStorage.getItem("holidays") || "[]");
  const known = new Set(windows.map((window) => window.name));

  // ?holiday=winter previews that holiday's theme whatever the date, for 24 hours or until the
  // footer's "Stop preview". Anything that isn't a holiday's name is ignored. (Before the app
  // has saved a calendar, any name is kept, and the app forgets it if it isn't a holiday.)
  const asked = new URLSearchParams(location.search).get("holiday");

  if (asked && /^[a-z]+$/.test(asked) && (known.size === 0 || known.has(asked))) {
    localStorage.setItem("holiday-preview", asked);
    localStorage.setItem("holiday-preview-at", String(now));
  }

  let previewing = localStorage.getItem("holiday-preview");
  const previewAt = Number(localStorage.getItem("holiday-preview-at")) || 0;

  if (previewing && now - previewAt >= 24 * 3_600_000) {
    localStorage.removeItem("holiday-preview");
    localStorage.removeItem("holiday-preview-at");
    previewing = null;
  }

  // The holiday on offer: a preview, or today's
  const offer = previewing
    ? { name: previewing, from: previewAt }
    : windows.find((window) => window.from <= now && now < window.until);

  const saved = localStorage.getItem("theme");
  const savedAt = Number(localStorage.getItem("theme-saved-at")) || 0;
  const week = 7 * 86_400_000;
  let theme = saved === "light" || saved === "dark" || saved === "holiday" ? saved : "system";

  if (offer) {
    const outdated = savedAt < offer.from && now - savedAt >= week;

    if (!saved || saved === "holiday" || outdated) theme = "holiday";
  } else if (theme === "holiday") {
    theme = "system";
  }

  if (theme === "light" || theme === "dark") root.dataset.theme = theme;

  if (theme === "holiday" && /^[a-z]+$/.test(offer.name)) {
    root.dataset.holiday = offer.name;
    document.querySelector('link[rel="icon"]').href = `/favicon-${offer.name}.svg`;
  }
} catch {
  // storage unavailable or unreadable: follow the system preference
}
