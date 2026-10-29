import { htmlSafe } from "@ember/template";

import { icons, type IconName } from "#app/icons.ts";

import type { TOC } from "@ember/component/template-only";

interface IconSignature {
  Args: {
    name: IconName;
    /** Accessible name; omit for decorative icons next to visible text */
    label?: string;
  };
  Element: HTMLSpanElement;
}

const svg = (name: IconName) => htmlSafe(icons[name]);

const Icon: TOC<IconSignature> = <template>
  {{#if @label}}
    <span class="icon" role="img" aria-label={{@label}} ...attributes>{{svg @name}}</span>
  {{else}}
    <span class="icon" aria-hidden="true" ...attributes>{{svg @name}}</span>
  {{/if}}
</template>;

export default Icon;
