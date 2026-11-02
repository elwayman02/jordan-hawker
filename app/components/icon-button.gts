import Icon from "#components/icon.gts";
import type { IconName } from "#app/icons.ts";

import type { TOC } from "@ember/component/template-only";

import "./icon-button.css";

interface IconButtonSignature {
  Args: {
    icon: IconName;
    /** What the button does, for screen readers */
    label: string;
  };
  Element: HTMLButtonElement;
}

/** A round button showing only an icon: `<IconButton @icon="chevronLeft" @label="Previous" {{on "click" …}} />` */
const IconButton: TOC<IconButtonSignature> = <template>
  <button type="button" class="icon-button" ...attributes>
    <Icon @name={{@icon}} @label={{@label}} />
  </button>
</template>;

export default IconButton;
