import Component from "@glimmer/component";
import { uniqueId } from "@ember/helper";

import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import { hellaDrunk } from "#app/data/site.ts";
import { take } from "#app/helpers/array.ts";
import { formatMonth, isoDate } from "#utils/format.ts";
import { api } from "#utils/remote.ts";

import "./hella-card.css";

interface HellaCardSignature {
  Args: {
    /** number of recent reviews to list */
    limit?: number;
    compact?: boolean;
  };
}

/** Jordan's wine & spirits review blog */
export default class HellaCard extends Component<HellaCardSignature> {
  hella = api("hella");

  /** The card can appear more than once on a page, so its heading's id can't be fixed */
  titleId = uniqueId();

  get limit() {
    return this.args.limit ?? 2;
  }

  <template>
    <aside class="hella {{if @compact 'hella--compact'}}" aria-labelledby={{this.titleId}}>
      <div class="hella__brand">
        <span class="hella__badge"><Icon @name="martini" /></span>
        <div>
          <p class="hella__kicker mono">also by me</p>
          <h2 class="hella__title" id={{this.titleId}}>{{hellaDrunk.name}}</h2>
        </div>
      </div>
      <p class="hella__tagline">{{hellaDrunk.tagline}}</p>

      <Await @remote={{this.hella}} @skeletonHeight="4rem">
        <:default as |hella|>
          <ul role="list" class="hella__posts">
            {{#each (take hella.posts this.limit) as |post|}}
              <li>
                <a href={{post.url}} target="_blank" rel="noopener noreferrer">{{post.title}}</a>
                <time datetime={{isoDate post.publishedAt}}>{{formatMonth post.publishedAt}}</time>
              </li>
            {{/each}}
          </ul>
        </:default>
        <:error></:error>
      </Await>

      <div class="hella__links">
        <a class="button" href={{hellaDrunk.url}} target="_blank" rel="noopener noreferrer">
          Read reviews
          <Icon @name="arrowUpRight" />
        </a>
        <a class="button" href={{hellaDrunk.instagram}} target="_blank" rel="noopener noreferrer">
          <Icon @name="instagram" />
          {{hellaDrunk.instagramHandle}}
        </a>
      </div>
    </aside>
  </template>
}
