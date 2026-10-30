import Await from "#components/await.gts";
import Icon from "#components/icon.gts";
import TrackList from "#components/sound/track-list.gts";
import VideoGrid from "#components/sound/video-grid.gts";
import pageTitle from "#app/helpers/page-title.ts";
import { music } from "#app/data/site.ts";
import { api } from "#utils/remote.ts";

<template>
  {{pageTitle "Sound"}}

  <div class="wrap page">
    <header class="page-header">
      <p class="eyebrow">sound</p>
      <h1>{{music.alias}}</h1>
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
    </header>

    {{#let (api "sound") as |sound|}}
      <section class="section" aria-labelledby="tracks">
        <div class="section-heading">
          <p class="eyebrow">tracks</p>
          <h2 id="tracks">Latest releases</h2>
        </div>
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
        <div class="section-heading">
          <p class="eyebrow">videos</p>
          <h2 id="videos">On YouTube</h2>
        </div>
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
  </div>
</template>
