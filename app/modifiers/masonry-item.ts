import { modifier } from "ember-modifier";

/**
 * Masonry for an item in a `.masonry` grid (see layout.css), until browsers
 * support `display: grid-lanes`.
 *
 * The grid has 1px rows, and each item spans as many rows as it is tall (plus the gap).
 * Grid auto-placement then puts every item in the shortest column, in order, so the
 * first items fill the top row and the DOM stays in reading order.
 * Re-measures whenever the item resizes (column width changes, fonts load).
 */
export default modifier((item: HTMLElement) => {
  if (CSS.supports("display", "grid-lanes")) return;

  const grid = item.parentElement;

  if (!grid) return;

  const observer = new ResizeObserver(([entry]) => {
    const height = entry?.borderBoxSize[0]?.blockSize ?? item.offsetHeight;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;

    item.style.gridRowEnd = `span ${Math.ceil(height + gap)}`;
  });

  observer.observe(item);

  return () => observer.disconnect();
});
