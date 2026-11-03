import Icon from "#components/icon.gts";
import { site } from "#app/data/site.ts";
import { isoDate, timeAgo } from "#utils/format.ts";
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
    <div class="listening__recent">
      <h3 class="listening__label">Recently played</h3>
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
              <a
                class="scrobble__name"
                href={{track.url}}
                target="_blank"
                rel="noopener noreferrer"
              >
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
    </div>

    <div class="listening__top">
      <h3 class="listening__label">Top artists this month</h3>
      <ol role="list" class="top-artists">
        {{#each @listening.topArtists as |artist|}}
          <li class="top-artists__item">
            <a href={{artist.url}} target="_blank" rel="noopener noreferrer">{{artist.name}}</a>
            <span class="top-artists__plays">{{plays artist.plays}}</span>
          </li>
        {{/each}}
      </ol>
      <a class="button" href={{site.lastfmUrl}} target="_blank" rel="noopener noreferrer">
        <Icon @name="lastfm" />
        Last.fm
      </a>
    </div>
  </div>
</template>;

export default ListeningNow;
