import { LinkTo } from "@ember/routing";

import Await from "#components/await.gts";
import HellaCard from "#components/hella-card.gts";
import Icon from "#components/icon.gts";
import SectionHeading from "#components/section-heading.gts";
import ProjectCard from "#components/codes/project-card.gts";
import CurrentlyReading from "#components/reads/currently-reading.gts";
import QuoteRotator from "#components/recommendations/quote-rotator.gts";
import ExperienceTimeline from "#components/resume/experience-timeline.gts";
import BlueskyFeed from "#components/social/bluesky-feed.gts";
import SocialLinks from "#components/social-links.gts";
import ScrobbleList from "#components/sound/scrobble-list.gts";
import TrackList from "#components/sound/track-list.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { highlightedRecommendations } from "#app/data/recommendations.ts";
import { contactLinks } from "#app/data/site.ts";
import { SECTIONS } from "#shared/sections.ts";
import { formatDate, isoDate } from "#utils/format.ts";
import { take } from "#app/helpers/array.ts";
import { api } from "#utils/remote.ts";

import "./index.css";

<template>
  {{pageTitle}}

  <section class="hero">
    <div class="wrap hero__inner">
      <div class="hero__copy">
        <p class="hero__kicker mono">
          Staff software engineer · SF Bay Area
          <a href="#contact" class="hero__status">Open to exciting opportunities</a>
        </p>
        <h1 class="hero__title">
          Hi, I’m Jordan.
          <span class="hero__statement">I build ambitious web applications, and the platforms,
            tooling and teams behind them.</span>
        </h1>
        <p class="hero__lede">
          Fifteen years building for the web at LinkedIn, Twitch, Yahoo and more: performance,
          platform architecture, developer experience, open source, and lately AI-powered product
          work. My next commit could be to your codebase.
        </p>
        <div class="hero__actions">
          <LinkTo @route="works" class="button primary">
            See my works
            <Icon @name="arrowRight" />
          </LinkTo>
          <a href="#contact" class="button">Get in touch</a>
        </div>
        <SocialLinks @links={{contactLinks}} class="hero__social" />
      </div>

      <nav class="hero__index" aria-labelledby="hero-index-label">
        <p class="hero__index-label" id="hero-index-label">Jordan…</p>
        {{! Each path reads as a verb: "Jordan… works", "Jordan… codes" }}
        {{#each SECTIONS as |item|}}
          <LinkTo @route={{item.name}} class="hero__index-link">
            <span class="hero__index-word"><span
                class="hero__index-slash"
              >/</span>{{item.name}}</span>
            <span class="hero__index-blurb">{{item.blurb}}</span>
            <Icon @name="arrowRight" class="hero__index-arrow" />
          </LinkTo>
        {{/each}}
      </nav>
    </div>
  </section>

  <div class="wrap">
    <section class="section home-works" aria-labelledby="home-works">
      <SectionHeading @eyebrow="works" @title="Where I’ve been building" @id="home-works" />
      <div class="home-works__grid">
        <Await @remote={{api "resume"}} @skeletonHeight="22rem" as |resume|>
          <div class="stack">
            <ExperienceTimeline @experience={{resume.experience}} @limit={{4}} />
            <LinkTo @route="works" class="link-arrow">
              Full resume
              <Icon @name="arrowRight" />
            </LinkTo>
          </div>
        </Await>
        <QuoteRotator @recommendations={{highlightedRecommendations}} />
      </div>
    </section>

    <section class="section" aria-labelledby="home-codes">
      <SectionHeading
        @eyebrow="codes"
        @title="Built in the open"
        @id="home-codes"
        @route="codes"
        @linkLabel="All projects"
      />
      <Await @remote={{api "codes"}} @skeletonHeight="14rem" as |codes|>
        <div class="project-grid">
          {{#each (take codes.active 6) as |repo|}}
            <ProjectCard @repo={{repo}} />
          {{/each}}
        </div>
      </Await>
    </section>

    <section class="section home-split">
      <div class="stack" aria-labelledby="home-sound">
        <SectionHeading
          @eyebrow="sound"
          @title="Fresh from the studio"
          @id="home-sound"
          @route="sound"
          @linkLabel="Listen"
        />
        <Await @remote={{api "sound"}} @skeletonHeight="13rem" as |sound|>
          <TrackList @tracks={{take sound.tracks 2}} />
        </Await>
      </div>
      <HellaCard />
    </section>

    {{! what I'm reading beside what I'm listening to }}
    <section class="section home-split home-now">
      <div class="stack" aria-labelledby="home-reads">
        <SectionHeading
          @eyebrow="reads"
          @title="Currently reading"
          @id="home-reads"
          @route="reads"
          @linkLabel="All reads"
        />
        <Await @remote={{api "reads"}} @skeletonHeight="16rem">
          <:default as |reads|>
            {{#if reads.current.length}}
              <CurrentlyReading @books={{take reads.current 1}} />
            {{else}}
              <p class="notice">Between books right now.</p>
            {{/if}}
          </:default>
          <:error>
            <p class="notice">Goodreads isn’t responding right now.</p>
          </:error>
        </Await>
      </div>

      <div class="stack" aria-labelledby="home-listening">
        <SectionHeading
          @eyebrow="listening"
          @title="Currently listening"
          @id="home-listening"
          @route="sound"
          @linkLabel="More"
        />
        <Await @remote={{api "listening"}} @skeletonHeight="16rem">
          <:default as |listening|>
            <ScrobbleList @tracks={{take listening.recent 5}} />
          </:default>
          <:error>
            <p class="notice">My listening history isn’t loading right now.</p>
          </:error>
        </Await>
      </div>
    </section>

    <section class="section" aria-labelledby="home-bluesky">
      <SectionHeading @eyebrow="lately" @title="On Bluesky" @id="home-bluesky" />
      <BlueskyFeed @layout="carousel" @limit={{8}} />
    </section>

    <Await @remote={{api "words"}} @skeletonHeight="3rem">
      <:default as |words|>
        {{#let (take words.posts 1) as |latest|}}
          {{#each latest as |post|}}
            <section class="section home-words" aria-label="Latest writing">
              <p class="eyebrow">words</p>
              <p>
                Latest writing:
                <LinkTo @route="words.post" @model={{post.slug}}>{{post.title}}</LinkTo>
                <time class="muted" datetime={{isoDate post.publishedAt}}>
                  ·
                  {{formatDate post.publishedAt}}</time>
              </p>
              <LinkTo @route="words" class="link-arrow">
                All words
                <Icon @name="arrowRight" />
              </LinkTo>
            </section>
          {{/each}}
        {{/let}}
      </:default>
      <:error></:error>
    </Await>
  </div>
</template>
