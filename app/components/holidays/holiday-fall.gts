import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { htmlSafe, type SafeString } from "@ember/template";
import type Owner from "@ember/owner";

import { PIECES } from "#components/holidays/pieces.ts";
import { holidayOffer, readSaved, resolveTheme } from "#utils/theme.ts";

import "./holiday-fall.css";

interface Piece {
  svg: SafeString;
  style: SafeString;
}

const between = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * A brief flurry of holiday pieces drifting down the screen, like snow. Plays once when the
 * site loads with a holiday theme on (not on later navigation, nor when switching themes),
 * and never for readers who prefer reduced motion.
 */
export default class HolidayFall extends Component {
  @tracked pieces: Piece[] = [];

  constructor(owner: Owner, args: object) {
    super(owner, args);

    const offer = holidayOffer();
    const holiday = resolveTheme(readSaved(), offer) === "holiday" ? offer?.holiday : undefined;
    const art = holiday && PIECES[holiday.name];

    if (!art?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sparse: about one piece per 60px of width
    const count = Math.round(Math.min(Math.max(window.innerWidth / 60, 10), 26));
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

  #landed = 0;

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
