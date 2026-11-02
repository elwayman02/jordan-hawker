import { LinkTo } from "@ember/routing";

import Icon from "#components/icon.gts";

import type { TOC } from "@ember/component/template-only";

interface SectionHeadingSignature {
  Args: {
    eyebrow: string;
    title: string;
    /** The <h2>'s id, for the section's aria-labelledby */
    id: string;
    /** A route to see more, linked beside the heading */
    route?: string;
    /** The link's text, e.g. "All projects" */
    linkLabel?: string;
  };
}

/** A section's eyebrow and <h2>, with an optional "see more" link beside them */
const SectionHeading: TOC<SectionHeadingSignature> = <template>
  {{#if @route}}
    <div class="section-heading section-heading--row">
      <div>
        <p class="eyebrow">{{@eyebrow}}</p>
        <h2 id={{@id}}>{{@title}}</h2>
      </div>
      <LinkTo @route={{@route}} class="link-arrow">
        {{@linkLabel}}
        <Icon @name="arrowRight" />
      </LinkTo>
    </div>
  {{else}}
    <div class="section-heading">
      <p class="eyebrow">{{@eyebrow}}</p>
      <h2 id={{@id}}>{{@title}}</h2>
    </div>
  {{/if}}
</template>;

export default SectionHeading;
