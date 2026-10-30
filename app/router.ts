import EmbroiderRouter from "@embroider/router";

import config from "#config";

export default class Router extends EmbroiderRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// Every section path is exactly five letters.
Router.map(function () {
  this.route("works");
  this.route("codes");
  this.route("sound");
  this.route("words", function () {
    this.route("post", { path: "/:slug" });
  });
  this.route("not-found", { path: "/*path" });
});
