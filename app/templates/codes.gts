import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import ProjectCard, { showStars } from "#components/codes/project-card.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { formatMonth, isoDate } from "#utils/format.ts";
import { api } from "#utils/remote.ts";

<template>
  {{pageTitle "Codes"}}

  <div class="wrap page">
    <header class="page-header">
      <p class="eyebrow">codes</p>
      <h1>Codes</h1>
      <p>
        Open-source projects I’ve built and maintain. Most are Ember addons; all of them scratched
        an itch.
      </p>
    </header>

    <Await @remote={{api "codes"}} @skeletonHeight="30rem">
      <:default as |codes|>
        <div class="project-grid">
          {{#each codes.active as |repo|}}
            <ProjectCard @repo={{repo}} />
          {{/each}}
        </div>

        {{#if codes.archive.length}}
          <details class="archive">
            <summary>Archive · {{codes.archive.length}} older projects</summary>
            <ul role="list" class="archive__list">
              {{#each codes.archive as |repo|}}
                <li>
                  <a href={{repo.url}} target="_blank" rel="noopener noreferrer">{{repo.name}}</a>
                  <span class="archive__description">{{repo.description}}</span>
                  <span class="archive__meta">
                    {{#if (showStars repo.stars)}}
                      <Icon @name="star" />
                      {{repo.stars}}
                      ·
                    {{/if}}
                    <time datetime={{isoDate repo.pushedAt}}>{{formatMonth repo.pushedAt}}</time>
                  </span>
                </li>
              {{/each}}
            </ul>
          </details>
        {{/if}}

      </:default>
      <:error>
        <p class="notice">
          GitHub isn’t responding right now —
          <a
            href="https://github.com/elwayman02?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >browse my repositories on GitHub</a>.
        </p>
      </:error>
    </Await>
  </div>
</template>
