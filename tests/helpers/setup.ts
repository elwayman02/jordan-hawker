import { beforeEach } from "vitest";

import indexHtml from "../../index.html?raw";

/**
 * index.html declares the order of the CSS cascade layers before any stylesheet loads. Tests
 * don't load index.html, so declare the same order here, ahead of every stylesheet; otherwise
 * layers rank by whichever stylesheet a test happens to import first.
 */
const layerOrder = /@layer [\w\s,-]+;/.exec(indexHtml)?.[0];

if (!layerOrder) throw new Error("index.html no longer declares the cascade layer order");

const style = document.createElement("style");

style.textContent = layerOrder;
document.head.prepend(style);

/**
 * Tests run with the plain (non-holiday) theme, whatever the real date: as if the reader had
 * just picked "system", which holds through any holiday (see resolveTheme in app/utils/theme.ts).
 * Tests of the holiday themes themselves clear this and set up their own dates and picks.
 */
beforeEach(() => {
  localStorage.setItem("theme", "system");
  localStorage.setItem("theme-saved-at", String(Date.now()));
});
