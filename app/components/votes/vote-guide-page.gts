import Component from "@glimmer/component";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { on } from "@ember/modifier";
import { eq, fn } from "@ember/helper";
import { LinkTo } from "@ember/routing";
import { modifier } from "ember-modifier";

import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { api } from "#utils/remote.ts";
import type { VoteGuide, Votes } from "#shared/api.ts";

import type RouterService from "@ember/routing/router-service";

import "#components/words/words.css";
import "./votes.css";

interface VoteGuidePageSignature {
  Args: {
    /** a past guide; the latest when omitted */
    slug?: string;
  };
}

const find = (votes: Votes, slug?: string) =>
  slug ? votes.guides.find((guide) => guide.slug === slug) : votes.guides[0];

const isLatest = (votes: Votes, guide: VoteGuide) => votes.guides[0] === guide;

/** Guide bodies are sanitized by /api/votes */
const body = (guide: VoteGuide) => htmlSafe(guide.body);

/** The ballot outline starts open beside the guide, and collapsed above it on small screens */
const openOnWideScreens = modifier((details: HTMLDetailsElement) => {
  details.open = window.matchMedia("(min-width: 48rem)").matches;
});

export default class VoteGuidePage extends Component<VoteGuidePageSignature> {
  @service declare router: RouterService;

  choose = (votes: Votes, event: Event) => {
    const slug = (event.target as HTMLSelectElement).value;

    if (slug === votes.guides[0]?.slug) {
      void this.router.transitionTo("votes.index");
    } else {
      void this.router.transitionTo("votes.guide", slug);
    }
  };

  <template>
    <div class="wrap page">
      <header class="page-header">
        <p class="eyebrow">votes</p>
        <h1>Votes</h1>
        <p>
          My progressive voter guides: how I’m voting, and why. Personal views, not my employer’s.
        </p>
      </header>

      <Await @remote={{api "votes"}} @skeletonHeight="40rem">
        <:default as |votes|>
          {{#let (find votes @slug) as |guide|}}
            {{#if guide}}
              {{pageTitle (if (isLatest votes guide) undefined guide.label) "Votes"}}

              <div class="votes__picker">
                <label for="votes-election">Election</label>
                <select id="votes-election" {{on "change" (fn this.choose votes)}}>
                  {{#each votes.guides as |choice index|}}
                    <option value={{choice.slug}} selected={{eq choice.slug guide.slug}}>
                      {{choice.label}}{{if (eq index 0) " (latest)"}}
                    </option>
                  {{/each}}
                </select>
              </div>

              <div class="split split--rail votes">
                <article class="vote-guide">
                  <header class="vote-guide__header">
                    <h2 class="vote-guide__title">{{guide.title}}</h2>
                    {{#if guide.subtitle}}
                      <p class="vote-guide__subtitle">{{guide.subtitle}}</p>
                    {{/if}}
                    {{#unless (isLatest votes guide)}}
                      <p class="notice">
                        This guide is from a past election.
                        <LinkTo @route="votes.index">See my latest guide</LinkTo>.
                      </p>
                    {{/unless}}
                  </header>

                  <div class="prose vote-guide__body">{{body guide}}</div>

                  <footer class="vote-guide__footer">
                    <a
                      href={{guide.url}}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="link-arrow"
                    >
                      Open in Google Docs
                      <Icon @name="arrowUpRight" />
                    </a>
                  </footer>
                </article>

                {{#if guide.outline.length}}
                  <details class="votes__outline" {{openOnWideScreens}}>
                    <summary>On this ballot</summary>
                    <nav aria-label="On this ballot">
                      {{#each guide.outline as |section|}}
                        {{#if section.title}}
                          <a href="#{{section.id}}" class="votes__outline-section">
                            {{section.title}}
                          </a>
                        {{/if}}
                        <ul role="list">
                          {{#each section.items as |item|}}
                            <li>
                              <a href="#{{item.id}}">{{item.title}}</a>
                              {{#if item.pick}}
                                <span class="pick pick--{{item.pick}}">{{item.pick}}</span>
                              {{/if}}
                            </li>
                          {{/each}}
                        </ul>
                      {{/each}}
                    </nav>
                  </details>
                {{/if}}
              </div>
            {{else}}
              {{pageTitle "Guide not found" "Votes"}}
              <p class="notice">
                I couldn’t find that guide.
                <LinkTo @route="votes.index">See my latest guide</LinkTo>.
              </p>
            {{/if}}
          {{/let}}
        </:default>
        <:error>
          <p class="notice">
            My voter guides aren’t loading right now. Please try again in a little while.
          </p>
        </:error>
      </Await>
    </div>
  </template>
}
