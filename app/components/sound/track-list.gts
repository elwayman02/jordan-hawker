import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";

import Icon from "#components/icon.gts";
import { formatDate, isoDate } from "#utils/format.ts";
import type { Track } from "#shared/api.ts";

import "./sound.css";

/**
 * SoundCloud's player is only loaded once a visitor presses play,
 * keeping the page fast and free of third-party scripts until then.
 */
function playerUrl(track: Track) {
  const params = new URLSearchParams({
    url: `https://api.soundcloud.com/tracks/${track.id}`,
    color: "#d9532b",
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    visual: "false",
  });

  return `https://w.soundcloud.com/player/?${params}`;
}

interface TrackListSignature {
  Args: {
    tracks: Track[];
  };
}

export default class TrackList extends Component<TrackListSignature> {
  @tracked playing: string | null = null;

  play = (track: Track) => {
    this.playing = track.id;
  };

  isPlaying = (track: Track) => this.playing === track.id;

  <template>
    <ol role="list" class="track-list">
      {{#each @tracks as |track|}}
        <li class="track">
          {{#if (this.isPlaying track)}}
            <iframe
              class="track__player"
              title="{{track.title}} on SoundCloud"
              src={{playerUrl track}}
              allow="autoplay"
              loading="lazy"
            ></iframe>
          {{else}}
            <button
              type="button"
              class="track__play"
              aria-label="Play {{track.title}}"
              {{on "click" (fn this.play track)}}
            >
              {{#if track.artwork}}
                <img src={{track.artwork}} alt="" loading="lazy" width="96" height="96" />
              {{/if}}
              <span class="track__play-icon"><Icon @name="play" /></span>
            </button>
            <div class="track__info">
              <a href={{track.url}} target="_blank" rel="noopener noreferrer" class="track__title">
                {{track.title}}
              </a>
              <span class="track__meta">
                <time datetime={{isoDate track.publishedAt}}>{{formatDate track.publishedAt}}</time>
                {{#if track.duration}}
                  ·
                  {{track.duration}}
                {{/if}}
              </span>
            </div>
          {{/if}}
        </li>
      {{/each}}
    </ol>
  </template>
}
