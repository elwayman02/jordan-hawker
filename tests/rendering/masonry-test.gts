import { htmlSafe } from "@ember/template";
import { render, waitUntil } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import masonryItem from "#app/modifiers/masonry-item.ts";

import "#app/styles/tokens.css";
import "#app/styles/layout.css";

const HEIGHTS = [100, 50, 80, 30, 30];

const height = (px: number) => htmlSafe(`height: ${px}px`);

describe("masonry-item", () => {
  renderingTest("fills the top row in order, then the shortest column", async ({ element }) => {
    // 600px wide with a 24px gap → three 184px columns
    await render(
      <template>
        <div class="masonry" style="width: 600px; --masonry-min: 100px; --masonry-gap: 24px">
          {{#each HEIGHTS as |px index|}}
            <div data-index={{index}} style={{height px}} {{masonryItem}}></div>
          {{/each}}
        </div>
      </template>,
    );

    const items = [...element.querySelectorAll<HTMLElement>("[data-index]")];
    const box = (index: number) => items[index]!.getBoundingClientRect();

    // ResizeObserver reports asynchronously
    await waitUntil(() => items.every((item) => item.style.gridRowEnd));

    const left = items.map((_, index) => Math.round(box(index).left));
    const columns = [...new Set(left)].toSorted((a, b) => a - b);

    expect(columns).toHaveLength(3);

    // 0, 1, 2 across the top
    expect([0, 1, 2].map((index) => columns.indexOf(left[index]!))).toEqual([0, 1, 2]);
    expect(new Set([0, 1, 2].map((index) => Math.round(box(index).top))).size).toBe(1);

    // 3 goes under the shortest (50px, column 2); then 4 under the next shortest (80px, column 3)
    expect(columns.indexOf(left[3]!)).toBe(1);
    expect(columns.indexOf(left[4]!)).toBe(2);

    // the gap is kept between stacked items
    expect(Math.round(box(3).top - box(1).bottom)).toBe(24);
  });
});
