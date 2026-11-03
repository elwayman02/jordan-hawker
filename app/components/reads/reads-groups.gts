import type { ReadsGroup } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./reads.css";

interface ReadsGroupsSignature {
  Args: {
    groups: ReadsGroup[];
    /** e.g. "Authors" */
    label: string;
  };
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** Authors or series, with how many I've read and any I own but haven't read yet */
const ReadsGroups: TOC<ReadsGroupsSignature> = <template>
  <div class="reads-groups">
    <h3 class="reads-groups__label">{{@label}}</h3>
    <ol class="reads-groups__list">
      {{#each @groups as |group|}}
        <li class="reads-groups__item">
          <span class="reads-groups__name">
            {{#if group.url}}
              <a href={{group.url}} target="_blank" rel="noopener noreferrer">{{group.name}}</a>
            {{else}}
              {{group.name}}
            {{/if}}
          </span>
          <span class="reads-groups__counts">
            {{! the badge goes first, so the book counts line up down the list }}
            {{#if group.owned.length}}
              <span class="chip reads-owned">{{group.owned.length}} on my shelf</span>
            {{/if}}
            {{plural group.read "book"}}
          </span>
        </li>
      {{/each}}
    </ol>
  </div>
</template>;

export default ReadsGroups;
