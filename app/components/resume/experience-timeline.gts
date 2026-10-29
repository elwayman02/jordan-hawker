import type { ResumeExperience } from "#shared/api.ts";
import type { TOC } from "@ember/component/template-only";

import "./experience-timeline.css";

const take = <T,>(items: T[], count: number) => items.slice(0, count);
const first = (items: string[]) => items[0];

interface ExperienceTimelineSignature {
  Args: {
    experience: ResumeExperience[];
    limit?: number;
  };
}

/** Compact, home-page view of the resume's EXPERIENCE section */
const ExperienceTimeline: TOC<ExperienceTimelineSignature> = <template>
  <ol role="list" class="timeline">
    {{#each (take @experience (if @limit @limit 5)) as |entry|}}
      <li class="timeline__entry">
        <div class="timeline__org">
          <h3>{{entry.org}}</h3>
          {{#if entry.location}}
            <span class="timeline__location">{{entry.location}}</span>
          {{/if}}
        </div>
        {{#each entry.roles as |role|}}
          <div class="timeline__role">
            <span class="timeline__title">{{role.title}}</span>
            {{#if role.dates}}
              <span class="timeline__dates">{{role.dates}}</span>
            {{/if}}
          </div>
          {{#if role.highlights.length}}
            <p class="timeline__highlight">{{first role.highlights}}</p>
          {{/if}}
        {{/each}}
      </li>
    {{/each}}
  </ol>
</template>;

export default ExperienceTimeline;
