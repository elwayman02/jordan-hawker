import Await from "#components/await.gts";
import HellaCard from "#components/hella-card.gts";
import BlueskyFeed from "#components/social/bluesky-feed.gts";
import PostList from "#components/words/post-list.gts";
import pageTitle from "#app/helpers/page-title.ts";
import stickyRail from "#app/modifiers/sticky-rail.ts";
import { api } from "#utils/remote.ts";
import PageHeader from "#components/page-header.gts";

<template>
  {{pageTitle "Words"}}

  <div class="wrap page split split--rail">
    <div>
      <PageHeader @section="words">
        <p>
          Longer-form writing on web technology, engineering careers, and the occasional tangent.
          For the day-to-day, find me on Bluesky.
        </p>
      </PageHeader>

      <Await @remote={{api "words"}} @skeletonHeight="30rem" as |words|>
        <PostList @posts={{words.posts}} />
      </Await>
    </div>

    <aside class="stack words__aside sticky-rail" aria-label="Elsewhere" {{stickyRail}}>
      {{! the Hella Drunk card is short, so it goes first where it's seen without scrolling }}
      <HellaCard @compact={{true}} />
      <h2 class="visually-hidden">Recent posts on Bluesky</h2>
      <BlueskyFeed @layout="list" @limit={{4}} />
    </aside>
  </div>
</template>
