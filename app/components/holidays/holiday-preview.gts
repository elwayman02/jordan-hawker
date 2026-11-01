import Component from "@glimmer/component";
import { on } from "@ember/modifier";

import { previewHoliday, stopPreview } from "#utils/theme.ts";

/**
 * Shown only while a holiday theme is being previewed out of season (?holiday=name),
 * with a way to stop. Visitors never see it.
 */
export default class HolidayPreview extends Component<{ Element: HTMLParagraphElement }> {
  /** Fixed for the page view: a preview only starts or stops with a page load */
  holiday = previewHoliday();

  <template>
    {{#if this.holiday}}
      <p class="holiday-preview" ...attributes>
        Previewing the
        {{this.holiday.label}}
        theme ·
        <button type="button" class="holiday-preview__stop" {{on "click" stopPreview}}>
          Stop preview
        </button>
      </p>
    {{/if}}
  </template>
}
