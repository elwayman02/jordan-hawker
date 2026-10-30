import { render } from "@ember/test-helpers";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import ResumeDocument from "#components/resume/resume-document.gts";
import { resume } from "#test-helpers/fake-api.ts";

describe("<ResumeDocument>", () => {
  renderingTest("renders sections, columns and bullets", async ({ element }) => {
    await render(<template><ResumeDocument @resume={{resume}} /></template>);

    expect(
      [...element.querySelectorAll(".resume__section-title")].map((h) => h.textContent),
    ).toEqual(["EXPERIENCE", "EDUCATION"]);
    expect(element.querySelector(".resume__line--role .resume__right")?.textContent).toBe(
      "2018 - 2026",
    );
    expect(element.querySelector(".resume__list li")?.innerHTML).toBe(
      "Re-architected <strong>46 repositories</strong>",
    );
  });

  renderingTest("falls back to the original document in a shadow root", async ({ element }) => {
    const unstructured = { ...resume, structured: false };

    await render(<template><ResumeDocument @resume={{unstructured}} /></template>);

    const host = element.querySelector(".resume--original");

    expect(element.querySelector(".resume__section")).toBeNull();
    expect(host?.shadowRoot?.querySelector("p")?.textContent).toBe("Original doc");
    // the doc's CSS stays inside the shadow root
    expect(getComputedStyle(element.querySelector(".resume--original")!).color).not.toBe(
      "rgb(255, 0, 0)",
    );
  });
});
