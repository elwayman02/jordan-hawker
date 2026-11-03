import { eq } from "@ember/helper";

import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import PageHeader from "#components/page-header.gts";
import BookCard from "#components/reads/book-card.gts";
import ReadsGroups from "#components/reads/reads-groups.gts";
import SectionHeading from "#components/section-heading.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { site } from "#app/data/site.ts";
import { api } from "#utils/remote.ts";

import "#components/reads/reads.css";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

<template>
  {{pageTitle "Reads"}}

  <div class="wrap page">
    <PageHeader @section="reads">
      <p>
        What I’m reading, the books I’ve loved, and what’s already waiting on my shelf. Straight
        from Goodreads, where I track everything I read.
      </p>
      <div class="hero__actions">
        <a
          class="button primary"
          href={{site.goodreadsUrl}}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon @name="goodreads" />
          Goodreads
        </a>
      </div>
    </PageHeader>

    <Await @remote={{api "reads"}} @skeletonHeight="40rem">
      <:default as |reads|>
        <dl class="reads-stats">
          <div>
            <dt>Books read</dt>
            <dd>{{reads.stats.read}}</dd>
          </div>
          <div>
            <dt>Average rating</dt>
            <dd>{{reads.stats.averageRating}}<Icon @name="star" class="reads-stats__star" /></dd>
          </div>
          {{#if reads.stats.genres.length}}
            <div class="reads-stats__genres">
              <dt>Favorite genres</dt>
              <dd>
                {{#each reads.stats.genres as |genre|}}
                  <span class="chip">{{genre}}</span>
                {{/each}}
              </dd>
            </div>
          {{/if}}
        </dl>

        {{#if reads.current.length}}
          <section class="section" aria-labelledby="reads-current">
            <SectionHeading @eyebrow="now" @title="Currently reading" @id="reads-current" />
            <div class="book-row">
              {{#each reads.current as |book|}}
                <BookCard @book={{book}} @featured={{true}} />
              {{/each}}
            </div>
          </section>
        {{/if}}

        <section class="section" aria-labelledby="reads-recent">
          <SectionHeading @eyebrow="lately" @title="Recently read" @id="reads-recent" />
          <div class="book-grid">
            {{#each reads.recent as |book|}}
              <BookCard @book={{book}} />
            {{/each}}
          </div>
        </section>

        {{#if reads.favorites.length}}
          <section class="section" aria-labelledby="reads-favorites">
            <SectionHeading @eyebrow="favorites" @title="Five stars" @id="reads-favorites" />
            <p class="muted reads-intro">
              Recent five-star reads, one per series or author.
            </p>
            <div class="book-grid">
              {{#each reads.favorites as |book|}}
                <BookCard @book={{book}} />
              {{/each}}
            </div>
          </section>
        {{/if}}

        <section class="section" aria-labelledby="reads-most">
          <SectionHeading @eyebrow="most-read" @title="Keep coming back to" @id="reads-most" />
          <div class="reads-most">
            <ReadsGroups @label="Authors" @groups={{reads.mostRead.authors}} />
            <ReadsGroups @label="Series" @groups={{reads.mostRead.series}} />
          </div>
        </section>

        {{#if reads.upNext.length}}
          <section class="section" aria-labelledby="reads-next">
            <SectionHeading @eyebrow="up next" @title="Already on my shelf" @id="reads-next" />
            <p class="muted reads-intro">
              Books I own from series and authors I’ve already started.
            </p>
            <div class="reads-next">
              {{#each reads.upNext as |group|}}
                <div class="reads-next__group">
                  <h3 class="reads-next__name">
                    {{group.name}}
                    <span class="reads-next__meta">
                      {{if (eq group.kind "series") "series" "author"}}
                      ·
                      {{plural group.read "book"}}
                      read
                    </span>
                  </h3>
                  <div class="book-grid book-grid--compact">
                    {{#each group.owned as |book|}}
                      <BookCard @book={{book}} />
                    {{/each}}
                  </div>
                </div>
              {{/each}}
            </div>
          </section>
        {{/if}}
      </:default>
      <:error>
        <p class="notice">
          Goodreads isn’t responding right now —
          <a href={{site.goodreadsUrl}} target="_blank" rel="noopener noreferrer">see my shelves on
            Goodreads</a>.
        </p>
      </:error>
    </Await>
  </div>
</template>
