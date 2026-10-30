import { LinkTo } from "@ember/routing";

import Await from "#components/await.gts";
import HellaCard from "#components/hella-card.gts";
import Icon from "#components/icon.gts";
import ProjectCard from "#components/codes/project-card.gts";
import QuoteRotator from "#components/recommendations/quote-rotator.gts";
import ExperienceTimeline from "#components/resume/experience-timeline.gts";
import BlueskyFeed from "#components/social/bluesky-feed.gts";
import SocialLinks from "#components/social-links.gts";
import TrackList from "#components/sound/track-list.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { highlightedRecommendations } from "#app/data/recommendations.ts";
import { contactLinks } from "#app/data/site.ts";
import { formatDate, isoDate } from "#utils/format.ts";
import { api } from "#utils/remote.ts";

import "./index.css";

const take = <T,>(items: T[], count: number) => items.slice(0, count);

/** Each path reads as a verb: "Jordan… works", "Jordan… codes" */
const INDEX = [
  { route: "works", blurb: "on ambitious web apps" },
  { route: "codes", blurb: "in the open" },
  { route: "sound", blurb: "out as Axle Hellfire" },
  { route: "words", blurb: "every now and then" },
] as const;

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
            tooling &amp; teams behind them.</span>
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
        {{#each INDEX as |item|}}
          <LinkTo @route={{item.route}} class="hero__index-link">
            <span class="hero__index-word"><span
                class="hero__index-slash"
              >/</span>{{item.route}}</span>
            <span class="hero__index-blurb">{{item.blurb}}</span>
            <Icon @name="arrowRight" class="hero__index-arrow" />
          </LinkTo>
        {{/each}}
      </nav>
    </div>
  </section>

  <div class="wrap">
    <section class="section home-works" aria-labelledby="home-works">
      <div class="section-heading">
        <p class="eyebrow">works</p>
        <h2 id="home-works">Where I’ve been building</h2>
      </div>
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
      <div class="section-heading section-heading--row">
        <div>
          <p class="eyebrow">codes</p>
          <h2 id="home-codes">Built in the open</h2>
        </div>
        <LinkTo @route="codes" class="link-arrow">
          All projects
          <Icon @name="arrowRight" />
        </LinkTo>
      </div>
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
        <div class="section-heading section-heading--row">
          <div>
            <p class="eyebrow">sound</p>
            <h2 id="home-sound">Fresh from the studio</h2>
          </div>
          <LinkTo @route="sound" class="link-arrow">
            Listen
            <Icon @name="arrowRight" />
          </LinkTo>
        </div>
        <Await @remote={{api "sound"}} @skeletonHeight="13rem" as |sound|>
          <TrackList @tracks={{take sound.tracks 2}} />
        </Await>
      </div>
      <HellaCard />
    </section>

    <section class="section" aria-labelledby="home-bluesky">
      <div class="section-heading">
        <p class="eyebrow">lately</p>
        <h2 id="home-bluesky">On Bluesky</h2>
      </div>
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
