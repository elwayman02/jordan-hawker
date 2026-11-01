/**
 * Renders the link-preview images (public/og/*.png, 1200×630) with headless Chrome:
 * one for the home page and one per section. See server/meta.ts, which points pages at them.
 *
 *   pnpm og-images
 *
 * Set CHROME to Chrome's path if it isn't in the usual place.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "public/og");
const chrome =
  process.env.CHROME ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome");

const font = (pkg, file) =>
  pathToFileURL(join(root, "node_modules/@fontsource-variable", pkg, "files", file)).href;

const lucide = JSON.parse(
  readFileSync(join(root, "node_modules/@iconify-json/lucide/icons.json"), "utf8"),
);
const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${lucide.icons[name].body}</svg>`;

/**
 * name → its card image. Only identifying text (the name of the section, and the site's):
 * the page's description already sits beside the image on Discord and Slack, so the image
 * doesn't repeat it, or anything the page itself says.
 */
const CARDS = {
  home: { title: "Jordan Hawker", home: true },
  works: { title: "Works", icon: "briefcase" },
  codes: { title: "Codes", icon: "code-xml" },
  sound: { title: "Sound", icon: "audio-lines" },
  words: { title: "Words", icon: "pen-line" },
  votes: { title: "Votes", icon: "vote" },
};

const page = ({ title, icon: iconName, home }) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: Fraunces; src: url(${font("fraunces", "fraunces-latin-opsz-normal.woff2")}); font-weight: 100 900; }
  @font-face { font-family: Fraunces; font-style: italic; src: url(${font("fraunces", "fraunces-latin-opsz-italic.woff2")}); font-weight: 100 900; }
  @font-face { font-family: Inter; src: url(${font("inter", "inter-latin-wght-normal.woff2")}); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(${font("jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2")}); font-weight: 100 800; }

  :root {
    --bg: oklch(16.5% 0.012 50);
    --text: oklch(94.5% 0.01 80);
    --muted: oklch(72% 0.02 70);
    --accent: oklch(72% 0.17 45);
  }

  body {
    margin: 0;
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background:
      radial-gradient(circle at 88% 18%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 55%),
      var(--bg);
    color: var(--text);
    font-family: Inter;
  }

  .card {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 72px 84px;
    display: flex;
    flex-direction: column;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 20px;
    font-weight: 650;
    font-size: 32px;
    letter-spacing: -0.01em;
  }

  .mark {
    display: grid;
    place-items: center;
    width: 68px;
    height: 68px;
    border-radius: 19px;
    background: var(--accent);
    color: var(--bg);
    font: italic 700 34px Fraunces;
  }

  h1 {
    margin: auto 0 6px;
    font: 600 156px/1 Fraunces;
    letter-spacing: -0.025em;
  }

  .url {
    position: absolute;
    top: 92px;
    right: 84px;
    color: var(--muted);
    font: 400 26px Mono;
  }

  .icon {
    position: absolute;
    right: 64px;
    bottom: 56px;
    width: 300px;
    height: 300px;
    color: var(--accent);
    opacity: 0.16;
  }
</style>
<div class="card">
  <div class="brand"><span class="mark">jh</span>${home ? "" : "Jordan Hawker"}</div>
  <span class="url">jordanhawker.com</span>
  ${iconName ? icon(iconName) : ""}
  <h1>${title}</h1>
</div>`;

const work = mkdtempSync(join(tmpdir(), "og-images-"));

for (const [name, card] of Object.entries(CARDS)) {
  const html = join(work, `${name}.html`);

  writeFileSync(html, page(card));
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      `--user-data-dir=${join(work, "profile")}`,
      "--window-size=1200,630",
      "--virtual-time-budget=3000",
      `--screenshot=${join(out, `${name}.png`)}`,
      pathToFileURL(html).href,
    ],
    { stdio: "ignore" },
  );
  console.log(`public/og/${name}.png`);
}
