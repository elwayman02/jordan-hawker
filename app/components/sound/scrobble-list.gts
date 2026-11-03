import ScrobbleArt from "#components/sound/scrobble-art.gts";
import { isoDate, timeAgo } from "#utils/format.ts";
import type { ListenedTrack } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./listening.css";

interface ScrobbleListSignature {
  Args: { tracks: ListenedTrack[] };
}

/** Songs I've played lately, newest first, from Last.fm */
const ScrobbleList: TOC<ScrobbleListSignature> = <template>
  <ol role="list" class="scrobbles">
    {{#each @tracks as |track|}}
      <li class="scrobble">
        <ScrobbleArt @src={{track.image}} />
        <span class="scrobble__info">
          <a class="scrobble__name" href={{track.url}} target="_blank" rel="noopener noreferrer">
            {{track.name}}
          </a>
          <span class="scrobble__artist">{{track.artist}}</span>
        </span>
        <time class="scrobble__when" datetime={{isoDate track.playedAt}}>
          {{timeAgo track.playedAt}}
        </time>
      </li>
    {{else}}
      <li class="notice">Nothing played lately.</li>
    {{/each}}
  </ol>
</template>;

export default ScrobbleList;
