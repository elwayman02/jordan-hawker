import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import RecommendationWall from "#components/recommendations/recommendation-wall.gts";
import ResumeDocument from "#components/resume/resume-document.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { recommendations } from "#app/data/recommendations.ts";
import { site } from "#app/data/site.ts";
import { timeAgo } from "#utils/format.ts";
import { api } from "#utils/remote.ts";

<template>
  {{pageTitle "Works"}}

  <div class="wrap page">
    <header class="page-header">
      <p class="eyebrow">works</p>
      <h1>Works</h1>
      <p>
        Fifteen years of shipping for the web, from ad platforms and live video to enterprise
        developer platforms.
      </p>
    </header>

    {{#let (api "resume") as |resume|}}
      <div class="split">
        <Await @remote={{resume}} @skeletonHeight="40rem">
          <:default as |data|>
            <ResumeDocument @resume={{data}} />

          </:default>
          <:error>
            <p class="notice">
              The resume couldn’t be loaded right now. You can always
              <a href={{site.resumeUrl}} target="_blank" rel="noopener noreferrer">read it on Google
                Docs</a>.
            </p>
          </:error>
        </Await>

        <aside class="sticky-aside stack" aria-label="Resume links">
          <a
            class="button primary"
            href={{site.resumeUrl}}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon @name="fileText" />
            Open in Google Docs
          </a>
          <a
            class="button"
            href="https://www.linkedin.com/in/jordanhawker/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon @name="linkedin" />
            LinkedIn profile
          </a>
          <a class="button" href="#recommendations">
            <Icon @name="quote" />
            Recommendations
          </a>
          <p class="muted works__sync">
            This resume is pulled live from its source document
            {{#if resume.fetchedAt}}
              (last synced
              {{timeAgo resume.fetchedAt}}).
            {{else}}
              and stays in sync automatically.
            {{/if}}
            {{#if resume.stale}}
              The source is unreachable at the moment, so this may be slightly out of date.
            {{/if}}
          </p>
        </aside>
      </div>
    {{/let}}

    <section class="section" aria-labelledby="recommendations">
      <div class="page-header">
        <p class="eyebrow">kind words</p>
        <h2 id="recommendations" class="works__recs-title">What colleagues say</h2>
      </div>
      <RecommendationWall @recommendations={{recommendations}} />
    </section>
  </div>
</template>
