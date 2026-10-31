import Icon from "#components/icon.gts";
import masonryItem from "#app/modifiers/masonry-item.ts";
import type { Recommendation } from "#app/data/recommendations.ts";

import type { TOC } from "@ember/component/template-only";

import "./recommendations.css";

interface RecommendationWallSignature {
  Args: { recommendations: Recommendation[] };
}

/** Staggered columns that read across rows, so the first (newest) fill the top row */
const RecommendationWall: TOC<RecommendationWallSignature> = <template>
  <ul role="list" class="recommendation-wall masonry">
    {{#each @recommendations as |recommendation|}}
      <li class="recommendation" {{masonryItem}}>
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
</template>;

export default RecommendationWall;
