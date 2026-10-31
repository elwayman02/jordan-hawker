import Route from "@ember/routing/route";
import { service } from "@ember/service";

import type RouterService from "@ember/routing/router-service";

export default class VotesGuideRoute extends Route {
  @service declare router: RouterService;

  /** "2024" or "2024/primary" */
  model({ slug }: { slug: string }) {
    return { slug: slug.replace(/\/$/, "") };
  }

  /** General elections live at just the year: /votes/2024/general → /votes/2024 */
  redirect({ slug }: { slug: string }) {
    const year = /^(\d{4})\/general$/i.exec(slug)?.[1];

    if (year) void this.router.replaceWith("votes.guide", year);
  }
}
