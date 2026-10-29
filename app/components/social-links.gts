import Icon from "#components/icon.gts";
import type { SocialLink } from "#app/data/site.ts";

import type { TOC } from "@ember/component/template-only";

interface SocialLinksSignature {
  Args: {
    links: SocialLink[];
    /** show the handle under each label */
    detailed?: boolean;
  };
  Element: HTMLUListElement;
}

const SocialLinks: TOC<SocialLinksSignature> = <template>
  <ul role="list" class="social-links {{if @detailed 'social-links--detailed'}}" ...attributes>
    {{#each @links as |link|}}
      <li>
        <a href={{link.url}} target="_blank" rel="me noopener noreferrer" class="social-link">
          {{#if @detailed}}
            <Icon @name={{link.icon}} />
            <span class="social-link__text">
              <span class="social-link__label">{{link.label}}</span>
              <span class="social-link__handle">{{link.handle}}</span>
            </span>
          {{else}}
            <Icon @name={{link.icon}} @label={{link.label}} />
          {{/if}}
        </a>
      </li>
    {{/each}}
  </ul>
</template>;

export default SocialLinks;
