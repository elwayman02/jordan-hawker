import Route from "@ember/routing/route";
import { service } from "@ember/service";

import { api } from "#utils/remote.ts";

import type RouterService from "@ember/routing/router-service";

/**
 * /votes shows the latest guide, then settles on its own address (e.g. /votes/2026)
 * once the guides have loaded. Navigation isn't held up waiting for the data,
 * and the address is replaced, so Back skips /votes.
 */
export default class VotesIndexRoute extends Route {
  @service declare router: RouterService;

  activate() {
    const votes = api("votes");

    void votes.promise.then(() => {
      const latest = votes.value?.guides[0];

      // the visitor may have moved on while the guides were loading
      if (!latest || this.router.currentRouteName !== "votes.index") return;

      // Ember drops the #fragment, so a link to a race (/votes#prop-1) restores it afterwards
      const hash = location.hash;

      void this.router.replaceWith("votes.guide", latest.slug).then(() => {
        if (!hash) return;

        history.replaceState(history.state, "", hash);
        // after the guide re-renders and the new page's scroll-to-top
        requestAnimationFrame(() =>
          document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(),
        );
      });
    });
  }
}
