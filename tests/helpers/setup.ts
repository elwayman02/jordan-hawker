import { beforeEach } from "vitest";

/**
 * Tests run with the plain (non-holiday) theme, whatever the real date: as if the reader had
 * just picked "system", which holds through any holiday (see resolveTheme in app/utils/theme.ts).
 * Tests of the holiday themes themselves clear this and set up their own dates and picks.
 */
beforeEach(() => {
  localStorage.setItem("theme", "system");
  localStorage.setItem("theme-saved-at", String(Date.now()));
});
