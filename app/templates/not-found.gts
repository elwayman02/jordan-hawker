import { LinkTo } from "@ember/routing";

import Icon from "#components/icon.gts";
import pageTitle from "#app/helpers/page-title.ts";

<template>
  {{pageTitle "Not found"}}

  <div class="wrap page">
    <header class="page-header">
      <p class="eyebrow">404</p>
      <h1>Nothing here.</h1>
      <p>Every page on this site has a five-letter name. This one doesn’t exist.</p>
      <LinkTo @route="index" class="link-arrow">
        <Icon @name="arrowLeft" />
        Back home
      </LinkTo>
    </header>
  </div>
</template>
