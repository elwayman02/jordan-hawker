import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { modifier } from "ember-modifier";

import Icon from "#components/icon.gts";
import type { Recommendation } from "#app/data/recommendations.ts";

import "./recommendations.css";

interface RecommendationWallSignature {
  Args: { recommendations: Recommendation[] };
}

const MAX_COLUMNS = 3;
/** in rem, matching .recommendation-wall in recommendations.css */
const MIN_COLUMN_WIDTH = 20;
const COLUMN_GAP = 1.5;

/**
 * A staggered wall that keeps reading order across the top: each card goes into
 * the shortest column so far (leftmost on a tie), so the newest fill the first row.
 * Plain CSS columns would instead run the newest down the first column.
 */
export function intoColumns<T>(items: T[], count: number, height: (item: T) => number): T[][] {
  const columns = Array.from({ length: count }, () => ({ items: [] as T[], height: 0 }));

  for (const item of items) {
    const shortest = columns.reduce((best, column) =>
      column.height < best.height ? column : best,
    );

    shortest.items.push(item);
    shortest.height += height(item);
  }

  return columns.map((column) => column.items);
}

/** Roughly how tall a card renders: its text plus the quote mark and byline */
const cardHeight = (recommendation: Recommendation) => recommendation.text.length + 250;

export default class RecommendationWall extends Component<RecommendationWallSignature> {
  @tracked count = MAX_COLUMNS;

  get columns() {
    return intoColumns(this.args.recommendations, this.count, cardHeight);
  }

  fitColumns = modifier((wall: HTMLElement) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? wall.clientWidth;
      const fits = Math.floor((width + COLUMN_GAP * rem) / ((MIN_COLUMN_WIDTH + COLUMN_GAP) * rem));
      const count = Math.max(1, Math.min(MAX_COLUMNS, fits));

      if (count !== this.count) this.count = count;
    });

    observer.observe(wall);

    return () => observer.disconnect();
  });

  <template>
    <div class="recommendation-wall" {{this.fitColumns}}>
      {{#each this.columns as |column|}}
        <ul role="list" class="recommendation-wall__column">
          {{#each column as |recommendation|}}
            <li class="recommendation">
              <Icon @name="quote" class="recommendation__mark" />
              <blockquote class="recommendation__text">
                <p>{{recommendation.text}}</p>
              </blockquote>
              <p class="recommendation__by">
                <span class="recommendation__name">{{recommendation.name}}</span>
                <span class="recommendation__role">{{recommendation.role}},
                  {{recommendation.company}}</span>
              </p>
            </li>
          {{/each}}
        </ul>
      {{/each}}
    </div>
  </template>
}
