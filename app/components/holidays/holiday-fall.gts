import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { htmlSafe, type SafeString } from "@ember/template";
import type Owner from "@ember/owner";

import { PIECES } from "#components/holidays/pieces.ts";
import { holidayOffer, readSaved, resolveTheme } from "#utils/theme.ts";

import type { Holiday } from "#utils/holidays.ts";

import "./holiday-fall.css";

interface Piece {
  svg: SafeString;
  style: SafeString;
}

const between = (min: number, max: number) => min + Math.random() * (max - min);

interface Flurry {
  play(holiday: Holiday): void;
  stop(): void;
}

/** The flurry on the page, if any, for the theme toggle to start or stop */
let current: Flurry | undefined;

/** Plays a holiday's flurry now: when the reader picks its theme on the toggle */
export function playFlurry(holiday: Holiday) {
  current?.play(holiday);
}

/** Stops any flurry: when the reader switches away from the holiday theme */
export function stopFlurry() {
  current?.stop();
}

/**
 * A brief flurry of holiday pieces drifting down the screen, like snow. Plays when the site
 * loads with a holiday theme on, and when the reader picks one on the toggle (not on later
 * navigation), and never for readers who prefer reduced motion.
 */
export default class HolidayFall extends Component {
  @tracked pieces: Piece[] = [];

  #landed = 0;
  #handle: Flurry = { play: (holiday) => this.play(holiday), stop: () => this.stop() };

  constructor(owner: Owner, args: object) {
    super(owner, args);

    current = this.#handle;

    const offer = holidayOffer();

    if (offer && resolveTheme(readSaved(), offer) === "holiday") this.play(offer.holiday);
  }

  willDestroy() {
    super.willDestroy();

    if (current === this.#handle) current = undefined;
  }

  play(holiday: Holiday) {
    const art = PIECES[holiday.name];

    if (!art?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sparse: about one piece per 60px of width
    const count = Math.round(Math.min(Math.max(window.innerWidth / 60, 10), 26));

    this.#landed = 0;
    this.pieces = Array.from({ length: count }, (_, index) => {
      const delay = between(0, 2.5);
      const fall = between(5, 8);
      const tilt = between(10, 35) * (Math.random() < 0.5 ? -1 : 1);

      return {
        svg: htmlSafe(art[index % art.length]!),
        style: htmlSafe(
          [
            `--x: ${between(0, 97).toFixed(1)}%`,
            `--size: ${between(14, 26).toFixed(0)}px`,
            `--delay: ${delay.toFixed(2)}s`,
            `--fall: ${fall.toFixed(2)}s`,
            `--sway: ${between(12, 40).toFixed(0)}px`,
            `--sway-time: ${between(1.8, 3.2).toFixed(2)}s`,
            `--tilt: ${tilt.toFixed(0)}deg`,
            `--alpha: ${between(0.65, 0.9).toFixed(2)}`,
          ].join("; "),
        ),
      };
    });
  }

  stop() {
    this.pieces = [];
  }

  /** Clears the flurry once every piece has finished falling (event-driven: no timers left behind) */
  landed = (event: AnimationEvent) => {
    if (event.animationName !== "holiday-fall") return;

    this.#landed += 1;
    if (this.#landed >= this.pieces.length) this.pieces = [];
  };

  <template>
    {{#if this.pieces.length}}
      <div class="holiday-fall" aria-hidden="true" {{on "animationend" this.landed}}>
        {{#each this.pieces as |piece|}}
          <span class="holiday-fall__piece" style={{piece.style}}>
            <span class="holiday-fall__sway">{{piece.svg}}</span>
          </span>
        {{/each}}
      </div>
    {{/if}}
  </template>
}
