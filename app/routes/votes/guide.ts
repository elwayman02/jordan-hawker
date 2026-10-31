import Route from "@ember/routing/route";

export default class VotesGuideRoute extends Route {
  model({ slug }: { slug: string }) {
    return { slug };
  }
}
