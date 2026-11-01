import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import type Owner from "@ember/owner";

import { playFlurry, stopFlurry } from "#components/holidays/holiday-fall.gts";
import Icon from "#components/icon.gts";
import {
  applyTheme,
  holidayOffer,
  readSaved,
  rememberHolidayWindows,
  resolveTheme,
  saveChoice,
  type ThemeChoice,
} from "#utils/theme.ts";

/**
 * Cycles system → light → dark, and the holiday theme while a holiday is near (shown by
 * default then: see resolveTheme in app/utils/theme.ts).
 */
export default class ThemeToggle extends Component {
  /** Fixed for the page view: a holiday doesn't start or end under the reader */
  offer = holidayOffer();

  /** What's showing: the reader's pick, or the default for today */
  @tracked theme: ThemeChoice = resolveTheme(readSaved(), this.offer);

  constructor(owner: Owner, args: object) {
    super(owner, args);

    rememberHolidayWindows();
    // public/theme.js applied this from a cache; settle it with today's calendar
    applyTheme(this.theme, this.holiday);
  }

  get holiday() {
    return this.offer?.holiday;
  }

  get order(): ThemeChoice[] {
    return this.holiday ? ["holiday", "system", "light", "dark"] : ["system", "light", "dark"];
  }

  get next(): ThemeChoice {
    return this.order[(this.order.indexOf(this.theme) + 1) % this.order.length]!;
  }

  name(theme: ThemeChoice) {
    if (theme !== "holiday") return theme;
    if (!this.holiday) return "system";

    return this.offer?.preview ? `${this.holiday.label} (preview)` : this.holiday.label;
  }

  get label() {
    return `Color theme: ${this.name(this.theme)}. Switch to ${this.name(this.next)}.`;
  }

  get icon() {
    if (this.theme === "holiday" && this.holiday) return this.holiday.icon;

    return this.theme === "system" ? "monitor" : this.theme === "light" ? "sun" : "moon";
  }

  cycle = () => {
    this.theme = this.next;
    saveChoice(this.theme);
    applyTheme(this.theme, this.holiday);

    // picking the holiday theme shows off its flurry; leaving it clears any still falling
    if (this.theme === "holiday" && this.holiday) playFlurry(this.holiday);
    else stopFlurry();
  };

  <template>
    <button
      type="button"
      class="theme-toggle"
      data-theme-choice={{this.theme}}
      title={{this.label}}
      {{on "click" this.cycle}}
    >
      <Icon @name={{this.icon}} @label={{this.label}} />
    </button>
  </template>
}
