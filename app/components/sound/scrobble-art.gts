import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { modifier } from "ember-modifier";

import Icon from "#components/icon.gts";

import "./listening.css";

interface ScrobbleArtSignature {
  Args: {
    /** album art from Last.fm, when it has any */
    src?: string;
  };
}

/**
 * A song's album art, or a placeholder when there's none. Last.fm sometimes lists art
 * that won't load, so a failed image falls back to the placeholder too.
 */
export default class ScrobbleArt extends Component<ScrobbleArtSignature> {
  @tracked failed = false;

  get showImage() {
    return Boolean(this.args.src) && !this.failed;
  }

  fallBackOnError = modifier((image: HTMLImageElement) => {
    const fail = () => (this.failed = true);

    // it may have failed before this listener was attached
    if (image.complete && image.naturalWidth === 0) {
      queueMicrotask(fail);

      return;
    }

    image.addEventListener("error", fail);

    return () => image.removeEventListener("error", fail);
  });

  <template>
    {{#if this.showImage}}
      <img
        class="scrobble__art"
        src={{@src}}
        alt=""
        loading="lazy"
        width="48"
        height="48"
        {{this.fallBackOnError}}
      />
    {{else}}
      <span class="scrobble__art scrobble__art--none"><Icon @name="audioLines" /></span>
    {{/if}}
  </template>
}
