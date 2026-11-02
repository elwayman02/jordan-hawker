import { click, render } from "@ember/test-helpers";
import { on } from "@ember/modifier";
import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";

import Await from "#components/await.gts";
import IconButton from "#components/icon-button.gts";
import PageHeader from "#components/page-header.gts";
import SectionHeading from "#components/section-heading.gts";
import { Remote } from "#utils/remote.ts";

const text = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, " ").trim();

describe("PageHeader", () => {
  renderingTest(
    "a section's page: its name and icon, its label as the title",
    async ({ element }) => {
      await render(
        <template>
          <PageHeader @section="codes"><p class="intro">Open source.</p></PageHeader>
        </template>,
      );

      expect(text(element.querySelector(".eyebrow"))).toBe("codes");
      expect(element.querySelector(".eyebrow .eyebrow__icon svg")).not.toBeNull();
      expect(text(element.querySelector("h1"))).toBe("Codes");
      expect(text(element.querySelector("header > .intro"))).toBe("Open source.");
    },
  );

  renderingTest("a section's page can title itself", async ({ element }) => {
    await render(<template><PageHeader @section="sound" @title="Axle Hellfire" /></template>);

    expect(text(element.querySelector(".eyebrow"))).toBe("sound");
    expect(text(element.querySelector("h1"))).toBe("Axle Hellfire");
  });

  renderingTest("any other page names its own eyebrow, with no icon", async ({ element }) => {
    await render(<template><PageHeader @eyebrow="404" @title="Nothing here." /></template>);

    expect(text(element.querySelector(".eyebrow"))).toBe("404");
    expect(element.querySelector(".eyebrow__icon")).toBeNull();
    expect(text(element.querySelector("h1"))).toBe("Nothing here.");
  });
});

describe("SectionHeading", () => {
  renderingTest("an eyebrow and an h2 that labels the section", async ({ element }) => {
    await render(
      <template>
        <SectionHeading @eyebrow="lately" @title="On Bluesky" @id="home-bluesky" />
      </template>,
    );

    expect(element.querySelector(".section-heading--row")).toBeNull();
    expect(text(element.querySelector(".eyebrow"))).toBe("lately");
    expect(element.querySelector("h2")?.id).toBe("home-bluesky");
    expect(text(element.querySelector("h2"))).toBe("On Bluesky");
  });

  renderingTest("with a route, a link to see more beside it", async ({ element }) => {
    await render(
      <template>
        <SectionHeading
          @eyebrow="codes"
          @title="Built in the open"
          @id="home-codes"
          @route="codes"
          @linkLabel="All projects"
        />
      </template>,
    );

    expect(element.querySelector(".section-heading--row")).not.toBeNull();
    expect(text(element.querySelector("a.link-arrow"))).toBe("All projects");
  });
});

describe("IconButton", () => {
  renderingTest(
    "a labelled button that passes on its attributes and modifiers",
    async ({ element }) => {
      let clicks = 0;
      const count = () => (clicks += 1);

      await render(
        <template>
          <IconButton @icon="chevronRight" @label="Next" class="extra" {{on "click" count}} />
        </template>,
      );

      const button = element.querySelector<HTMLButtonElement>("button.icon-button.extra")!;

      expect(button.type).toBe("button");
      expect(button.querySelector("[role=img]")?.getAttribute("aria-label")).toBe("Next");

      await click(button);

      expect(clicks).toBe(1);
    },
  );
});

describe("Await", () => {
  renderingTest("announces loading as a status", async ({ element }) => {
    const pending = new Remote(() => new Promise<never>(() => {}));

    await render(
      <template>
        <Await @remote={{pending}}>loaded</Await>
      </template>,
    );

    const skeleton = element.querySelector(".skeleton");

    expect(skeleton?.getAttribute("role")).toBe("status");
    expect(text(skeleton)).toBe("Loading…");
  });
});
