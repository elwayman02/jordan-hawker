import { LinkTo } from "@ember/routing";

import Icon from "#components/icon.gts";
import PageHeader from "#components/page-header.gts";
import pageTitle from "#app/helpers/page-title.ts";

<template>
  {{pageTitle "Not found"}}

  <div class="wrap page">
    <PageHeader @eyebrow="404" @title="Nothing here.">
      <p>Every page on this site has a five-letter name. This one doesn’t exist.</p>
      <LinkTo @route="index" class="link-arrow">
        <Icon @name="arrowLeft" />
        Back home
      </LinkTo>
    </PageHeader>
  </div>
</template>
