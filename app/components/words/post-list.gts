import { LinkTo } from "@ember/routing";

import { formatDate, isoDate } from "#utils/format.ts";
import type { PostSummary } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./words.css";

interface PostListSignature {
  Args: { posts: PostSummary[] };
}

const PostList: TOC<PostListSignature> = <template>
  <ol role="list" class="post-list">
    {{#each @posts as |post|}}
      <li class="post-item">
        <time class="post-item__date mono" datetime={{isoDate post.publishedAt}}>
          {{formatDate post.publishedAt}}
        </time>
        <h2 class="post-item__title">
          <LinkTo @route="words.post" @model={{post.slug}}>{{post.title}}</LinkTo>
        </h2>
        <p class="post-item__excerpt">{{post.excerpt}}</p>
      </li>
    {{/each}}
  </ol>
</template>;

export default PostList;
