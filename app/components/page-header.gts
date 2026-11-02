import Icon from "#components/icon.gts";
import { SECTIONS, type SectionName } from "#shared/sections.ts";

import type { TOC } from "@ember/component/template-only";

interface PageHeaderSignature {
  Args: {
    /** A section's page: its name and icon as the eyebrow, its label as the default title */
    section?: SectionName;
    /** The eyebrow for a page that isn't a section's (404, a missing post) */
    eyebrow?: string;
    /** The page's <h1> (default: the section's label) */
    title?: string;
  };
  /** The intro, and any actions beneath it */
  Blocks: { default: [] };
  Element: HTMLElement;
}

const sectionOf = (name: SectionName | undefined) => SECTIONS.find((entry) => entry.name === name);

/** The top of a page: eyebrow, title, then whatever introduces it */
const PageHeader: TOC<PageHeaderSignature> = <template>
  {{#let (sectionOf @section) as |entry|}}
    <header class="page-header" ...attributes>
      {{#if entry}}
        <p class="eyebrow">{{entry.name}}<Icon @name={{entry.icon}} class="eyebrow__icon" /></p>
        <h1>{{if @title @title entry.label}}</h1>
      {{else}}
        <p class="eyebrow">{{@eyebrow}}</p>
        <h1>{{@title}}</h1>
      {{/if}}
      {{yield}}
    </header>
  {{/let}}
</template>;

export default PageHeader;
