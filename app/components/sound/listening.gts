import ScrobbleList from "#components/sound/scrobble-list.gts";
import type { Listening } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./listening.css";

interface ListeningSignature {
  Args: { listening: Listening };
}

/** What I've been listening to lately, from Last.fm */
const ListeningNow: TOC<ListeningSignature> = <template>
  <div class="listening">
    <h3 class="listening__label">Recently played</h3>
    <ScrobbleList @tracks={{@listening.recent}} />

    {{#if @listening.topArtists.length}}
      <h3 class="listening__label">Recent top artists</h3>
      <ol role="list" class="top-artists">
        {{#each @listening.topArtists as |artist|}}
          <li class="top-artists__item">
            <a href={{artist.url}} target="_blank" rel="noopener noreferrer">{{artist.name}}</a>
            {{#if artist.tags.length}}
              <span class="top-artists__tags">
                {{#each artist.tags as |tag|}}
                  <span class="chip">{{tag}}</span>
                {{/each}}
              </span>
            {{/if}}
          </li>
        {{/each}}
      </ol>
    {{/if}}
  </div>
</template>;

export default ListeningNow;
