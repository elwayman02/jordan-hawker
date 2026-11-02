/** The reader asked their system for less motion: skip animations and auto-advancing */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
