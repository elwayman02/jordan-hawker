import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import ListeningNow from "#components/sound/listening.gts";
import PageHeader from "#components/page-header.gts";
import SectionHeading from "#components/section-heading.gts";
import TrackList from "#components/sound/track-list.gts";
import VideoGrid from "#components/sound/video-grid.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { music } from "#app/data/site.ts";
import { api } from "#utils/remote.ts";

<template>
  {{pageTitle "Sound"}}

  <div class="wrap page">
    <PageHeader @section="sound" @title={{music.alias}}>
      <p>
        After years curating vibes at dance events across the country, I now spend my time in the
        studio writing and producing original music as
        {{music.alias}}.
      </p>
      <div class="hero__actions">
        <a
          class="button primary"
          href={{music.soundcloud}}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon @name="soundcloud" />
          SoundCloud
        </a>
        <a class="button" href={{music.youtube}} target="_blank" rel="noopener noreferrer">
          <Icon @name="youtube" />
          YouTube
        </a>
        <a class="button" href={{music.bandcamp}} target="_blank" rel="noopener noreferrer">
          <Icon @name="bandcamp" />
          Bandcamp
        </a>
      </div>
    </PageHeader>

    {{#let (api "sound") as |sound|}}
      <section class="section" aria-labelledby="tracks">
        <SectionHeading @eyebrow="tracks" @title="Latest releases" @id="tracks" />
        <Await @remote={{sound}} @skeletonHeight="20rem" as |data|>
          {{#if data.tracks.length}}
            <TrackList @tracks={{data.tracks}} />
          {{else}}
            <p class="notice">
              SoundCloud isn’t responding right now —
              <a href={{music.soundcloud}} target="_blank" rel="noopener noreferrer">listen on
                SoundCloud</a>.
            </p>
          {{/if}}
        </Await>
      </section>

      <section class="section" aria-labelledby="videos">
        <SectionHeading @eyebrow="videos" @title="On YouTube" @id="videos" />
        <Await @remote={{sound}} @skeletonHeight="14rem" as |data|>
          {{#if data.videos.length}}
            <VideoGrid @videos={{data.videos}} />
          {{else}}
            <p class="notice">
              New videos are on the way here —
              <a href={{music.youtube}} target="_blank" rel="noopener noreferrer">watch on YouTube</a>
              in the meantime.
            </p>
          {{/if}}
        </Await>
      </section>
    {{/let}}

    <section class="section" aria-labelledby="listening">
      <SectionHeading @eyebrow="listening" @title="What I’m listening to" @id="listening" />
      <Await @remote={{api "listening"}} @skeletonHeight="24rem">
        <:default as |listening|>
          <ListeningNow @listening={{listening}} />
        </:default>
        <:error>
          <p class="notice">My listening history isn’t loading right now.</p>
        </:error>
      </Await>
    </section>
  </div>
</template>
