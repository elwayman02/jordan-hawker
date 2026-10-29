import { htmlSafe } from "@ember/template";

import Icon from "#components/icon.gts";
import { compactNumber, isoDate, timeAgo } from "#utils/format.ts";
import type { Repo } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./codes.css";

/** GitHub's linguist colors for the languages that show up in these repos */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Handlebars: "#f7931e",
  "Glimmer JS": "#f5835f",
  "Glimmer TS": "#3178c6",
  Shell: "#89e051",
  Python: "#3572A5",
  Java: "#b07219",
};

const dot = (language: string) =>
  htmlSafe(`--language: ${LANGUAGE_COLORS[language] ?? "var(--muted)"}`);

const firstTopics = (topics: string[]) => topics.slice(0, 3);

interface ProjectCardSignature {
  Args: { repo: Repo };
  Element: HTMLElement;
}

const ProjectCard: TOC<ProjectCardSignature> = <template>
  <article class="project-card" ...attributes>
    <h3 class="project-card__name">
      <a href={{@repo.url}} target="_blank" rel="noopener noreferrer">{{@repo.name}}</a>
    </h3>

    {{#if @repo.description}}
      <p class="project-card__description">{{@repo.description}}</p>
    {{/if}}

    {{#if @repo.topics.length}}
      <ul role="list" class="project-card__topics">
        {{#each (firstTopics @repo.topics) as |topic|}}
          <li class="chip">{{topic}}</li>
        {{/each}}
      </ul>
    {{/if}}

    <footer class="project-card__meta">
      {{#if @repo.language}}
        <span class="project-card__language" style={{dot @repo.language}}>{{@repo.language}}</span>
      {{/if}}
      <span title="Stars">
        <Icon @name="star" />
        {{compactNumber @repo.stars}}
        <span class="visually-hidden">stars</span>
      </span>
      {{#if @repo.forks}}
        <span title="Forks">
          <Icon @name="gitFork" />
          {{compactNumber @repo.forks}}
          <span class="visually-hidden">forks</span>
        </span>
      {{/if}}
      <time datetime={{isoDate @repo.pushedAt}} class="project-card__updated">
        updated
        {{timeAgo @repo.pushedAt}}
      </time>
    </footer>
  </article>
</template>;

export default ProjectCard;
