import Icon from "#components/icon.gts";
import { site } from "#app/data/site.ts";
import type { Reads } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./reads.css";

interface ReadsStatsSignature {
  Args: { stats: Reads["stats"] };
  Element: HTMLElement;
}

/** My top-level Goodreads numbers, with a link to the profile */
const ReadsStats: TOC<ReadsStatsSignature> = <template>
  <aside class="reads-stats" aria-label="Reading stats" ...attributes>
    <dl class="reads-stats__numbers">
      <div>
        <dt>Books read</dt>
        <dd>{{@stats.read}}</dd>
      </div>
      <div>
        <dt>Average rating</dt>
        <dd>{{@stats.averageRating}}<Icon @name="star" class="reads-stats__star" /></dd>
      </div>
      {{#if @stats.genres.length}}
        <div class="reads-stats__genres">
          <dt>Favorite genres</dt>
          <dd>
            {{#each @stats.genres as |genre|}}
              <span class="chip">{{genre}}</span>
            {{/each}}
          </dd>
        </div>
      {{/if}}
    </dl>
    <a class="button primary" href={{site.goodreadsUrl}} target="_blank" rel="noopener noreferrer">
      <Icon @name="goodreads" />
      Goodreads
    </a>
  </aside>
</template>;

export default ReadsStats;
