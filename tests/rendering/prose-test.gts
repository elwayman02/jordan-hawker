import { render } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import "#app/styles/tokens.css";
// votes.css first: in the built app, prose.css comes after it
import "#components/votes/votes.css";
import "#app/styles/prose.css";

describe(".prose", () => {
  renderingTest(
    "pages can restyle it, whatever order the stylesheets load in",
    async ({ element }) => {
      await render(
        <template>
          <div class="prose"><h3>Plain</h3></div>
          <div class="prose vote-guide__body"><h3>Guide</h3></div>
        </template>,
      );

      const [plain, guide] = [...element.querySelectorAll("h3")].map((heading) =>
        parseFloat(getComputedStyle(heading).fontSize),
      );

      // a voter guide's sections are bigger than prose's own h3 (--step-2, not --step-1)
      expect(guide).toBeGreaterThan(plain!);
    },
  );
});
