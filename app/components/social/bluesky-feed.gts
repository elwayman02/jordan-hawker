import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { modifier } from "ember-modifier";

import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import { site } from "#app/data/site.ts";
import { blueskyPosts } from "#utils/bluesky.ts";
import { compactNumber, isoDate, timeAgo } from "#utils/format.ts";

import "./bluesky-feed.css";

interface BlueskyFeedSignature {
  Args: {
    /** carousel: horizontal, scroll-snapped (home). list: vertical (sidebar). */
    layout?: "carousel" | "list";
    limit?: number;
  };
}

export default class BlueskyFeed extends Component<BlueskyFeedSignature> {
  posts = blueskyPosts(site.blueskyHandle, this.args.limit ?? 6);

  #track?: HTMLElement;

  get isCarousel() {
    return (this.args.layout ?? "carousel") === "carousel";
  }

  registerTrack = modifier((element: HTMLElement) => {
    this.#track = element;
  });

  scroll = (direction: 1 | -1) => {
    const track = this.#track;

    if (!track) return;

    const card = track.querySelector("li");
    const distance = (card?.getBoundingClientRect().width ?? 320) + 16;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  previous = () => this.scroll(-1);
  next = () => this.scroll(1);

  <template>
    <div class="bluesky {{if this.isCarousel 'bluesky--carousel' 'bluesky--list'}}">
      <div class="bluesky__header">
        <a
          href="https://bsky.app/profile/{{site.blueskyHandle}}"
          target="_blank"
          rel="noopener noreferrer"
          class="bluesky__handle"
        >
          <Icon @name="bluesky" />
          @{{site.blueskyHandle}}
        </a>
        {{#if this.isCarousel}}
          <div class="bluesky__controls">
            <button type="button" class="quote-rotator__button" {{on "click" this.previous}}>
              <Icon @name="chevronLeft" @label="Previous posts" />
            </button>
            <button type="button" class="quote-rotator__button" {{on "click" this.next}}>
              <Icon @name="chevronRight" @label="More posts" />
            </button>
          </div>
        {{/if}}
      </div>

      <Await @remote={{this.posts}} @skeletonHeight="12rem">
        <:default as |posts|>
          <ul
            role="list"
            class="bluesky__track"
            aria-roledescription={{if this.isCarousel "carousel"}}
            aria-label="Recent posts on Bluesky"
            tabindex={{if this.isCarousel "0"}}
            {{this.registerTrack}}
          >
            {{#each posts as |post|}}
              <li class="skeet">
                <p class="skeet__text">
                  {{#each post.parts as |part|}}
                    {{#if part.href}}
                      <a
                        href={{part.href}}
                        target="_blank"
                        rel="noopener noreferrer"
                      >{{part.text}}</a>
                    {{else}}
                      {{part.text}}
                    {{/if}}
                  {{/each}}
                </p>

                {{#if post.images.length}}
                  <div class="skeet__images" data-count={{post.images.length}}>
                    {{#each post.images as |image|}}
                      <img src={{image.thumb}} alt={{image.alt}} loading="lazy" />
                    {{/each}}
                  </div>
                {{/if}}

                {{#if post.external}}
                  <a
                    href={{post.external.url}}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="skeet__card"
                  >
                    {{#if post.external.thumb}}
                      <img src={{post.external.thumb}} alt="" loading="lazy" />
                    {{/if}}
                    <span class="skeet__card-text">
                      <span class="skeet__card-host">{{post.external.host}}</span>
                      <span class="skeet__card-title">{{post.external.title}}</span>
                    </span>
                  </a>
                {{/if}}

                {{#if post.quote}}
                  <a
                    href={{post.quote.url}}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="skeet__quote"
                  >
                    <span class="skeet__quote-author">{{post.quote.author}}</span>
                    <span class="skeet__quote-text">{{post.quote.text}}</span>
                  </a>
                {{/if}}

                <footer class="skeet__meta">
                  <a href={{post.url}} target="_blank" rel="noopener noreferrer">
                    <time datetime={{isoDate post.createdAt}}>{{timeAgo post.createdAt}}</time>
                  </a>
                  <span class="skeet__stats">
                    <span title="Replies"><Icon @name="messageCircle" />
                      {{compactNumber post.replies}}</span>
                    <span title="Reposts"><Icon @name="repeat" />
                      {{compactNumber post.reposts}}</span>
                    <span title="Likes"><Icon @name="heart" /> {{compactNumber post.likes}}</span>
                  </span>
                </footer>
              </li>
            {{else}}
              <li class="notice">Nothing posted lately.</li>
            {{/each}}
          </ul>

        </:default>
        <:error>
          <p class="notice">
            Bluesky isn’t responding right now —
            <a
              href="https://bsky.app/profile/{{site.blueskyHandle}}"
              target="_blank"
              rel="noopener noreferrer"
            >see posts on bsky.app</a>.
          </p>
        </:error>
      </Await>
    </div>
  </template>
}
