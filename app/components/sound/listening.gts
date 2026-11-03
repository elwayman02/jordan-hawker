import Icon from "#components/icon.gts";
import { site } from "#app/data/site.ts";
import { isoDate, timeAgo } from "#utils/format.ts";
import type { Listening } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./listening.css";

interface ListeningSignature {
  Args: { listening: Listening };
}

/** What I've been listening to lately, from Last.fm */
const ListeningNow: TOC<ListeningSignature> = <template>
  <div class="listening">
    <ol role="list" class="scrobbles">
      {{#each @listening.recent as |track|}}
        <li class="scrobble {{if track.nowPlaying 'scrobble--now'}}">
          {{#if track.image}}
            <img
              class="scrobble__art"
              src={{track.image}}
              alt=""
              loading="lazy"
              width="48"
              height="48"
            />
          {{else}}
            <span class="scrobble__art scrobble__art--none"><Icon @name="audioLines" /></span>
          {{/if}}
          <span class="scrobble__info">
            <a class="scrobble__name" href={{track.url}} target="_blank" rel="noopener noreferrer">
              {{track.name}}
            </a>
            <span class="scrobble__artist">{{track.artist}}</span>
          </span>
          {{#if track.nowPlaying}}
            <span class="chip scrobble__now">
              <span class="scrobble__bars" aria-hidden="true"><i></i><i></i><i></i></span>
              Now playing
            </span>
          {{else if track.playedAt}}
            <time class="scrobble__when" datetime={{isoDate track.playedAt}}>
              {{timeAgo track.playedAt}}
            </time>
          {{/if}}
        </li>
      {{else}}
        <li class="notice">Nothing played lately.</li>
      {{/each}}
    </ol>

    <a class="button" href={{site.lastfmUrl}} target="_blank" rel="noopener noreferrer">
      <Icon @name="lastfm" />
      Last.fm
    </a>
  </div>
</template>;

export default ListeningNow;
