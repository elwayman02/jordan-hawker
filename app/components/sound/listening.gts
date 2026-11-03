import ScrobbleList from "#components/sound/scrobble-list.gts";
import type { Listening } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./listening.css";

interface ListeningSignature {
  Args: { listening: Listening };
}

const plays = (count: number) => `${count} ${count === 1 ? "play" : "plays"}`;

/** What I've been listening to lately, from Last.fm */
const ListeningNow: TOC<ListeningSignature> = <template>
  <div class="listening">
    <h3 class="listening__label">Recently played</h3>
    <ScrobbleList @tracks={{@listening.recent}} />

    {{#if @listening.topArtists.length}}
      <h3 class="listening__label">Top artists this week</h3>
      <ol role="list" class="top-artists">
        {{#each @listening.topArtists as |artist|}}
          <li class="top-artists__item">
            <a href={{artist.url}} target="_blank" rel="noopener noreferrer">{{artist.name}}</a>
            <span class="top-artists__plays">{{plays artist.plays}}</span>
          </li>
        {{/each}}
      </ol>
    {{/if}}
  </div>
</template>;

export default ListeningNow;
