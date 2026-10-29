import Await from "#components/await.gts";
import HellaCard from "#components/hella-card.gts";
import BlueskyFeed from "#components/social/bluesky-feed.gts";
import PostList from "#components/words/post-list.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { api } from "#utils/remote.ts";

<template>
  {{pageTitle "Words"}}

  <div class="wrap page">
    <header class="page-header">
      <p class="eyebrow">words</p>
      <h1>Words</h1>
      <p>
        Longer-form writing on Ember, engineering careers, and the occasional tangent. For the
        day-to-day, find me on Bluesky.
      </p>
    </header>

    <div class="split">
      <Await @remote={{api "words"}} @skeletonHeight="30rem" as |words|>
        <PostList @posts={{words.posts}} />
      </Await>

      <aside class="stack words__aside" aria-label="Elsewhere">
        <h2 class="visually-hidden">Recent posts on Bluesky</h2>
        <BlueskyFeed @layout="list" @limit={{4}} />
        <HellaCard @compact={{true}} />
      </aside>
    </div>
  </div>
</template>
