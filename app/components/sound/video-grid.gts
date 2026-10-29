import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";

import Icon from "#components/icon.gts";
import { formatDate, isoDate } from "#utils/format.ts";
import type { Video } from "#shared/api.ts";

import "./sound.css";

const embedUrl = (video: Video) =>
  `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;

interface VideoGridSignature {
  Args: { videos: Video[] };
}

/** Thumbnails until clicked; then a privacy-enhanced YouTube embed */
export default class VideoGrid extends Component<VideoGridSignature> {
  @tracked playing: string | null = null;

  play = (video: Video) => {
    this.playing = video.id;
  };

  isPlaying = (video: Video) => this.playing === video.id;

  <template>
    <ul role="list" class="video-grid">
      {{#each @videos as |video|}}
        <li class="video">
          <div class="video__frame">
            {{#if (this.isPlaying video)}}
              <iframe
                title={{video.title}}
                src={{embedUrl video}}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowfullscreen
              ></iframe>
            {{else}}
              <button
                type="button"
                class="video__poster"
                aria-label="Play {{video.title}}"
                {{on "click" (fn this.play video)}}
              >
                <img src={{video.thumbnail}} alt="" loading="lazy" />
                <span class="video__play"><Icon @name="play" /></span>
              </button>
            {{/if}}
          </div>
          <a href={{video.url}} target="_blank" rel="noopener noreferrer" class="video__title">
            {{video.title}}
          </a>
          <time class="video__date" datetime={{isoDate video.publishedAt}}>
            {{formatDate video.publishedAt}}
          </time>
        </li>
      {{/each}}
    </ul>
  </template>
}
