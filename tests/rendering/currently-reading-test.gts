import { render } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import CurrentlyReading from "#components/reads/currently-reading.gts";
import { reads } from "#test-helpers/fake-api.ts";

describe("<CurrentlyReading>", () => {
  renderingTest("shows one book on its own", async ({ element }) => {
    const books = reads.current.slice(0, 1);

    await render(<template><CurrentlyReading @books={{books}} /></template>);

    expect(element.querySelectorAll(".book--featured")).toHaveLength(1);
    expect(element.querySelector(".current-reads--carousel")).toBeNull();
  });

  renderingTest("turns into a carousel for more than one", async ({ element }) => {
    const books = [...reads.current, ...reads.recent];

    await render(<template><CurrentlyReading @books={{books}} /></template>);

    expect(element.querySelectorAll(".current-reads__track > li")).toHaveLength(books.length);
    expect(
      [...element.querySelectorAll(".current-reads__controls button")].map((button) =>
        button.querySelector("[aria-label]")?.getAttribute("aria-label"),
      ),
    ).toEqual(["Previous book", "Next book"]);
  });
});
