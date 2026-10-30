import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";

import Icon from "#components/icon.gts";
import type { IconName } from "#app/icons.ts";

interface CopyButtonSignature {
  Args: {
    /** copied to the clipboard */
    value: string;
    /** shown on the button; defaults to the value */
    label?: string;
    icon: IconName;
    /** names what's being copied, for screen readers */
    description: string;
  };
  Element: HTMLButtonElement;
}

/** For contact methods with no link to open, like a Discord username */
export default class CopyButton extends Component<CopyButtonSignature> {
  @tracked copied = false;

  #timer?: ReturnType<typeof setTimeout>;

  copy = async () => {
    try {
      await navigator.clipboard.writeText(this.args.value);
    } catch {
      // no clipboard access; the value is still visible on the button
      return;
    }

    this.copied = true;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => (this.copied = false), 2000);
  };

  willDestroy() {
    super.willDestroy();
    clearTimeout(this.#timer);
  }

  <template>
    <button
      type="button"
      class="button copy-button"
      title="Copy {{@description}}"
      {{on "click" this.copy}}
      ...attributes
    >
      <Icon @name={{@icon}} />
      {{if @label @label @value}}
      <span class="copy-button__status" aria-live="polite">
        {{if this.copied "Copied!" "Copy"}}
      </span>
    </button>
  </template>
}
