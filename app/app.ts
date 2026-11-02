import Application from "@ember/application";
import setupInspector from "@embroider/legacy-inspector-support/ember-source-4.12";

import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/prose.css";
import "./styles/holidays.css";

export default class App extends Application {
  modules = {
    ...import.meta.glob("./router.*", { eager: true }),
    ...import.meta.glob("./routes/**/*", { eager: true }),
    ...import.meta.glob("./templates/**/*", { eager: true }),
    // The app has no services. Adding some? Glob "./services/**/*" here too, and note that
    // addons' services aren't merged in: https://github.com/embroider-build/embroider/issues/2659
  };
  inspector = setupInspector(this);
}
