import SiteFooter from "#components/site-footer.gts";
import SiteHeader from "#components/site-header.gts";
import HolidayFall from "#components/holidays/holiday-fall.gts";

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="site">
    <SiteHeader />
    <main id="main" tabindex="-1">
      {{outlet}}
    </main>
    <SiteFooter />
  </div>
  <HolidayFall />
</template>
