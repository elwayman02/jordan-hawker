/** The site's own accent, should the theme's be unreadable */
const FALLBACK = "#d9532b";

/** Any CSS color as #rrggbb (via a canvas, which resolves oklch() and the like), if valid */
export function toHex(color: string): string | undefined {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });

  if (!context || !CSS.supports("color", color)) return undefined;

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;

  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The page's accent color right now (light or dark, holiday theme or not) as #rrggbb, for
 * embeds that only take a hex color, like SoundCloud's player.
 */
export function accentHex(): string {
  try {
    const probe = document.createElement("span");

    probe.style.color = "var(--accent)";
    document.body.append(probe);

    const color = getComputedStyle(probe).color;

    probe.remove();

    return toHex(color) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
