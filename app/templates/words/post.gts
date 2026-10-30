import { htmlSafe } from "@ember/template";
import { LinkTo } from "@ember/routing";

import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { formatDate, isoDate } from "#utils/format.ts";
import { api } from "#utils/remote.ts";
import type { Post } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "#components/words/words.css";

const find = (posts: Post[], slug: string) => posts.find((post) => post.slug === slug);

/** Post bodies are sanitized by /api/words */
const body = (post: Post) => htmlSafe(post.body);

const PostTemplate: TOC<{ Args: { model: { slug: string } } }> = <template>
  <div class="wrap page">
    <Await @remote={{api "words"}} @skeletonHeight="40rem" as |words|>
      {{#let (find words.posts @model.slug) as |post|}}
        {{#if post}}
          {{pageTitle post.title "Words"}}
          <article class="article">
            <header class="article__header">
              <LinkTo @route="words" class="eyebrow">words</LinkTo>
              <h1>{{post.title}}</h1>
              <div class="article__meta">
                <time datetime={{isoDate post.publishedAt}}>{{formatDate post.publishedAt}}</time>
                {{#each post.tags as |tag|}}
                  <span class="chip">#{{tag}}</span>
                {{/each}}
              </div>
            </header>

            <div class="prose">{{body post}}</div>

            <footer class="article__footer">
              <LinkTo @route="words" class="link-arrow">
                <Icon @name="arrowLeft" />
                All words
              </LinkTo>
              <a href={{post.url}} target="_blank" rel="noopener noreferrer" class="link-arrow">
                Originally on Tumblr
                <Icon @name="arrowUpRight" />
              </a>
            </footer>
          </article>
        {{else}}
          {{pageTitle "Post not found"}}
          <header class="page-header">
            <p class="eyebrow">words</p>
            <h1>Post not found</h1>
            <p>That post may have moved or been retired.</p>
            <LinkTo @route="words" class="link-arrow">
              <Icon @name="arrowLeft" />
              All words
            </LinkTo>
          </header>
        {{/if}}
      {{/let}}
    </Await>
  </div>
</template>;

export default PostTemplate;
