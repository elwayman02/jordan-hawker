import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { array } from "@ember/helper";
import { on } from "@ember/modifier";
import { modifier } from "ember-modifier";

import Icon from "#components/icon.gts";
import type { Recommendation } from "#app/data/recommendations.ts";

import "./recommendations.css";

interface QuoteRotatorSignature {
  Args: {
    recommendations: Recommendation[];
    /** ms between quotes */
    interval?: number;
  };
}

/**
 * One recommendation at a time, advancing on a timer.
 * Pauses on hover/focus, and never auto-advances for reduced-motion users.
 */
export default class QuoteRotator extends Component<QuoteRotatorSignature> {
  @tracked index = Math.floor(Math.random() * this.args.recommendations.length);
  @tracked paused = false;

  get current() {
    return this.args.recommendations[this.index % this.args.recommendations.length];
  }

  get position() {
    return `${(this.index % this.args.recommendations.length) + 1} of ${this.args.recommendations.length}`;
  }

  next = () => {
    this.index = (this.index + 1) % this.args.recommendations.length;
  };

  previous = () => {
    const count = this.args.recommendations.length;

    this.index = (this.index - 1 + count) % count;
  };

  pause = () => (this.paused = true);
  resume = () => (this.paused = false);

  autoplay = modifier(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      if (!this.paused && document.visibilityState === "visible") this.next();
    }, this.args.interval ?? 9000);

    return () => clearInterval(timer);
  });

  <template>
    {{#if this.current}}
      <figure
        class="quote-rotator"
        aria-roledescription="carousel"
        aria-label="Recommendations"
        {{this.autoplay}}
        {{on "mouseenter" this.pause}}
        {{on "mouseleave" this.resume}}
        {{on "focusin" this.pause}}
        {{on "focusout" this.resume}}
      >
        <Icon @name="quote" class="quote-rotator__mark" />
        {{#each (array this.current) key="text" as |recommendation|}}
          <div class="quote-rotator__slide" aria-live={{if this.paused "polite" "off"}}>
            <blockquote class="quote-rotator__text">
              <p>{{recommendation.text}}</p>
            </blockquote>
            <figcaption class="quote-rotator__by">
              <span class="recommendation__name">{{recommendation.name}}</span>
              <span class="recommendation__role">{{recommendation.role}},
                {{recommendation.company}}</span>
            </figcaption>
          </div>
        {{/each}}
        <div class="quote-rotator__controls">
          <button type="button" class="quote-rotator__button" {{on "click" this.previous}}>
            <Icon @name="chevronLeft" @label="Previous recommendation" />
          </button>
          <span class="quote-rotator__position mono">{{this.position}}</span>
          <button type="button" class="quote-rotator__button" {{on "click" this.next}}>
            <Icon @name="chevronRight" @label="Next recommendation" />
          </button>
        </div>
      </figure>
    {{/if}}
  </template>
}
