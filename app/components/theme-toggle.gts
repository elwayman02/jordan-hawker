import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";

import Icon from "#components/icon.gts";

type Theme = "system" | "light" | "dark";

const ORDER: Theme[] = ["system", "light", "dark"];
const KEY = "theme";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY);

    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * Cycles system → light → dark. The choice is applied as <html data-theme>,
 * which public/theme.js also applies before first paint.
 */
export default class ThemeToggle extends Component {
  @tracked theme: Theme = readTheme();

  get label() {
    return `Color theme: ${this.theme}. Switch to ${this.next}.`;
  }

  get next(): Theme {
    return ORDER[(ORDER.indexOf(this.theme) + 1) % ORDER.length]!;
  }

  get icon() {
    return this.theme === "system" ? "monitor" : this.theme === "light" ? "sun" : "moon";
  }

  cycle = () => {
    this.theme = this.next;

    if (this.theme === "system") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = this.theme;
    }

    try {
      if (this.theme === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, this.theme);
    } catch {
      // storage unavailable (private mode): the choice lasts for this page view
    }
  };

  <template>
    <button type="button" class="theme-toggle" title={{this.label}} {{on "click" this.cycle}}>
      <Icon @name={{this.icon}} @label={{this.label}} />
    </button>
  </template>
}
