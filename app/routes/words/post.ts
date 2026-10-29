import Route from "@ember/routing/route";

export default class WordsPostRoute extends Route {
  model({ slug }: { slug: string }) {
    return { slug };
  }
}
