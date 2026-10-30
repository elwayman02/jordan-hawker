import { modifier } from "ember-modifier";

/**
 * Publishes the element's height as `--rail-height`, so `.sticky-rail` can stick
 * by its top when it fits in the viewport, or by its bottom when it's taller:
 * a tall rail scrolls with the page until its end is in view, then stays put.
 */
export default modifier((element: HTMLElement) => {
  const observer = new ResizeObserver(([entry]) => {
    const height = entry?.borderBoxSize[0]?.blockSize ?? element.offsetHeight;

    element.style.setProperty("--rail-height", `${Math.ceil(height)}px`);
  });

  observer.observe(element);

  return () => observer.disconnect();
});
